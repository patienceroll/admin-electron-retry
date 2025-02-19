import { Button, Form, Input, Modal, Radio, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { addSupplier } from "src/apps/admin/api/supplier";

import useWather from "src/hooks/use-wather";

type AddSupplierResponse = Awaited<ReturnType<typeof addSupplier>>["data"];

type Ref = {
  create: () => Promise<AddSupplierResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: AddSupplierResponse | PromiseLike<AddSupplierResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<AddSupplierResponse>((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        open.setTrue();
        form.resetFields();
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addSupplier(store);
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
      title="新建供应商"
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
      <Form form={form} autoComplete="off" labelCol={{ span: 4 }} initialValues={{status:1}}>
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="简称" name="short_name">
          <Input placeholder="请输入简称" />
        </Form.Item>
        <Form.Item
          label="地址"
          name="address"
          rules={[{ required: true, message: "请输入地址" }]}
        >
          <Input placeholder="请输入地址" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入备注" />
        </Form.Item>
        <Form.Item label="状态" name="status" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
