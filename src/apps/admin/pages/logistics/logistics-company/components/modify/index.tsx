import { Button, Form, Input, Modal, Radio, Space } from "antd";
import React from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  addLogisticsCompany,
  editLogisticsCompany,
} from "src/apps/admin/api/logistics-company";
import useWather from "src/hooks/use-wather";

type Ref = {
  edit: (item: LogisticsCompany) => Promise<void>;
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
    item: LogisticsCompany | undefined;
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
          return editLogisticsCompany({ id: config.current.item.id, ...store });
        return addLogisticsCompany(store);
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
          title: "新建运输公司",
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
          title: "编辑运输公司",
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
          label="名称"
          name="name"
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入备注" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
