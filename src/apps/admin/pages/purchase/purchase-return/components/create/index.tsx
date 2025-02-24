import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { addProduceReturn } from "src/apps/admin/api/produce-return";

import { getPurchaseOrderOptions } from "src/apps/admin/api/purchase-order";
import { getPurchaseReceiveOptions } from "src/apps/admin/api/purchase-receive";
import { getSupplierOption } from "src/apps/admin/api/supplier";
import useOption from "src/hooks/use-option";
import useWather from "src/hooks/use-wather";

type Ref = {
  create: () => Promise<ProduceReturnAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: ProduceReturnAddResponse | PromiseLike<ProduceReturnAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [supplier] = useOption(getSupplierOption);
  const [purchaseOrder] = useOption(getPurchaseOrderOptions);
  const [purchaseReceive] = useOption(getPurchaseReceiveOptions);

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
        purchaseOrder.params.status = 3;
        purchaseOrder.params.statuses = [1, 2];
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addProduceReturn(store);
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
      title="新建采购退货"
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
      <Form form={form} autoComplete="off" labelCol={{ span: 4 }}>
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
              purchaseOrder.params.supplier_id = e;
              purchaseOrder.loadOption();
              purchaseReceive.params.supplier_id = e;
              purchaseReceive.loadOption();
              form.setFieldValue("purchase_order_id", undefined);
              form.setFieldValue("purchase_receive_id", undefined);
            }}
          />
        </Form.Item>
        <Form.Item label="采购订单" name="purchase_order_id">
          <Select
            options={purchaseOrder.list}
            loading={purchaseOrder.loading}
            placeholder="请选择采购订单"
            filterOption
            showSearch
            optionFilterProp="code"
            fieldNames={{ label: "code", value: "id" }}
            onChange={(e) => {
              purchaseReceive.params.purchase_order_id = e;
              purchaseReceive.loadOption();
              form.setFieldValue("purchase_receive_id", undefined);
            }}
          />
        </Form.Item>
        <Form.Item
          label="采购收货"
          name="purchase_receive_id"
          rules={[{ required: true, message: "请选择采购收货" }]}
        >
          <Select
            options={purchaseReceive.list}
            loading={purchaseReceive.loading}
            placeholder="请选择采购收货"
            filterOption
            showSearch
            optionFilterProp="code"
            fieldNames={{ label: "code", value: "id" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
