import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { getPurchaseApplyOptions } from "src/apps/admin/api/purchase-apply";
import { getPurchaseContractOption } from "src/apps/admin/api/purchase-contract";
import { addPurchaseOrder } from "src/apps/admin/api/purchase-order";
import { getSupplierOption } from "src/apps/admin/api/supplier";
import useOption from "src/hooks/use-option";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

type Ref = {
  create: () => Promise<PurchaseOrderAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: PurchaseOrderAddResponse | PromiseLike<PurchaseOrderAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [supplier] = useOption(getSupplierOption);
  const [purchaseApply] = useOption(getPurchaseApplyOptions);
  const [purchaseContract] = useOption(getPurchaseContractOption);

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        form.resetFields();
        open.setTrue();
        supplier.loadOption();
        purchaseApply.params.statuses = [1, 2];
        purchaseApply.params.type = 1;
        purchaseContract.params.statuses = [1, 2];
        purchaseApply.loadOption();
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addPurchaseOrder(store);
      })
      .then((res) => {
        loading.setTrue();
        promiseResolver.current.resolve(res.data);
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  return (
    <Modal
      title="新建采购订单"
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={open.setFalse}
      footer={
        <Space>
          <Button onClick={open.setFalse} disabled={loading.whether}>
            关闭
          </Button>
          <Button type="primary" loading={loading.whether} onClick={submit}>
            保存
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 6 }}
        initialValues={{ type: 1 }}
      >
        <Form.Item label="申请类型" name="type">
          <Radio.Group
            onChange={(e) => {
              purchaseApply.params.type = e.target.value;
              purchaseApply.loadOption();
              form.setFieldValue("purchase_apply_id", undefined);
            }}
          >
            <Radio value={1}>大宗物资</Radio>
            <Radio value={4}>生产</Radio>
            <Radio value={5}>直销</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="采购申请单"
          name="purchase_apply_id"
          rules={[{ required: true, message: "请选择采购申请单" }]}
        >
          <Select
            options={purchaseApply.list}
            loading={purchaseApply.loading}
            placeholder="请选择采购申请单"
            filterOption
            showSearch
            optionFilterProp="code"
            fieldNames={{ label: "code", value: "id" }}
          />
        </Form.Item>
        <Form.Item
          label="供应商"
          name="supplier_id"
          rules={[{ required: true, message: "请选择供应商" }]}
        >
          <Select
            options={supplier.list}
            placeholder="请选择供应商"
            filterOption
            showSearch
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "id" }}
            onChange={(e) => {
              form.setFieldValue("purchase_contract_id", undefined);
              purchaseContract.params.supplier_id = e;
              purchaseContract.loadOption();
            }}
          />
        </Form.Item>
        <Form.Item
          label="采购合同"
          name="purchase_contract_id"
          rules={[{ required: true, message: "请选择采购合同" }]}
        >
          <Select
            options={purchaseContract.list}
            loading={purchaseContract.loading}
            placeholder="请选择采购合同"
            filterOption
            showSearch
            optionFilterProp="code"
            fieldNames={{ label: "name", value: "id" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
