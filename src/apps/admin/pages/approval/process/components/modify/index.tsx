import { Button, Form, Input, Modal, Radio, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import {
  postApprovalProcess,
  putApprovalProcess,
} from "src/apps/admin/api/process";
import useWather from "src/hooks/use-wather";

type Ref = {
  edit: (item: Approval) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const config = useRef<{
    resolve: () => void;
    reject: (reason?: any) => void;
    title: string;
    item: Approval | undefined;
  }>({
    reject() {},
    resolve() {},
    title: "",
    item: undefined,
  });

  const [form] = Form.useForm();
  const [loading] = useWather();
  const [open] = useWather();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (config.current.item)
          return putApprovalProcess({ id: config.current.item.id, ...store });
        return postApprovalProcess(store);
      })
      .then(() => {
        config.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "新建工序",
          item: undefined,
        };
        open.setTrue();
        form.resetFields();
      });
    },

    edit(item) {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "编辑工序",
          item: item,
        };
        open.setTrue();
        form.setFieldsValue(item);
      });
    },
  }));

  return (
    <Modal
      title={config.current.title}
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
        initialValues={{ status: 1 }}
      >
        <Form.Item
          name="name"
          label="工序"
          rules={[{ required: true, message: "请输入工序" }]}
        >
          <Input placeholder="请输入工序" />
        </Form.Item>
        <Form.Item name="code" label="编号">
          <Input placeholder="请输入编号" />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea allowClear placeholder="请输入备注" />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
