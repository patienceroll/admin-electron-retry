import { Button, Form, Input, Modal, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import useWather from "src/hooks/use-wather";

import { addBusinessOpportunity } from "src/apps/admin/api/business-opportunity";

type Ref = {
  create: () => Promise<BusinessOpportunityAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value:
        | BusinessOpportunityAddResponse
        | PromiseLike<BusinessOpportunityAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addBusinessOpportunity(store);
      })
      .then((res) => {
        loading.setTrue();
        promiseResolver.current.resolve(res.data);
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        open.setTrue();
        form.resetFields();
      });
    },
  }));

  return (
    <Modal
      title="新建机会"
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
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item label="业务机会" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入业务机会名称" />
        </Form.Item>
        <Form.Item label="简称" name="short_name" rules={[{ required: true }]}>
          <Input placeholder="请输入业务机会简称" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
