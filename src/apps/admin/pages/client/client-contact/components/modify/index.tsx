import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getClientOption } from "src/apps/admin/api/client";
import {
  addClientContact,
  editClientContact,
} from "src/apps/admin/api/client-concat";
import useOption from "src/hooks/use-option";

import useWather from "src/hooks/use-wather";

type Ref = {
  edit: (item: ClientContact) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [client] = useOption(getClientOption);

  const [item, setItem] = useState<ClientContact>();

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item) return editClientContact({ id: item.id, ...store });
        return addClientContact(store);
      })
      .then(() => {
        promiseResolver.current.resolve();
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

    edit(item) {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        open.setTrue();
        setItem(item);
        form.setFieldsValue(item);
      });
    },
  }));

  return (
    <Modal
      title={item ? "编辑联系人" : "新建联系人"}
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
        <Form.Item label="客户" name="client_id" rules={[{ required: true }]}>
          <Select
            options={client.list}
            allowClear
            showSearch
            placeholder="请选择客户"
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "id" }}
          />
        </Form.Item>
        <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入联系人姓名" />
        </Form.Item>
        <Form.Item label="职务" name="job_title">
          <Input placeholder="请输入职务" />
        </Form.Item>
        <Form.Item label="电话" name="phone">
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item label="微信" name="wechat">
          <Input placeholder="请输入微信" />
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
