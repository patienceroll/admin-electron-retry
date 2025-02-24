import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import {
  addPurchaseContract,
  getPurchaseContractOption,
} from "src/apps/admin/api/purchase-contract";
import { getSupplierOption } from "src/apps/admin/api/supplier";
import useOption from "src/hooks/use-option";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

type Ref = {
  create: () => Promise<PurchaseContractAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value:
        | PurchaseContractAddResponse
        | PromiseLike<PurchaseContractAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [update] = useUpdate();

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [purchaseContract] = useOption(getPurchaseContractOption);
  const [suppler] = useOption(getSupplierOption);

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        form.resetFields();
        open.setTrue();
        purchaseContract.params.statuses = [1, 2, 3, 4];
        purchaseContract.loadOption()
        suppler.loadOption()
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addPurchaseContract(store);
      })
      .then((res) => {
        loading.setTrue();
        promiseResolver.current.resolve(res.data);
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  const contractType = form.getFieldValue("type");

  return (
    <Modal
      title="新建采购合同"
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={open.setFalse}
      footer={
        <Space>
          <Button onClick={open.setFalse} disabled={loading.whether}>
            关闭
          </Button>
          <Button
            type="primary"
            disabled={!contractType}
            loading={loading.whether}
            onClick={submit}
          >
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 4 }}>
        <Form.Item name="type" label="类型">
          <Radio.Group onChange={update}>
            <Radio value={1}>主合同</Radio>
            <Radio value={2}>补充协议</Radio>
          </Radio.Group>
        </Form.Item>

        {contractType === 2 && (
          <Form.Item label="主合同" name="pid" rules={[{ required: true }]}>
            <Select
              options={purchaseContract.list}
              loading={purchaseContract.loading}
              placeholder="请选择"
              filterOption
              showSearch
              optionFilterProp="name"
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>
        )}

        {contractType === 1 && (
          <>
            <Form.Item
              label="供应商"
              name="supplier_id"
              rules={[{ required: true }]}
            >
              <Select
                options={suppler.list}
                placeholder="请选择"
                fieldNames={{ label: "name", value: "id" }}
                filterOption
                showSearch
                optionFilterProp="name"
              />
            </Form.Item>
            <Form.Item label="名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入合同名称" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
});
