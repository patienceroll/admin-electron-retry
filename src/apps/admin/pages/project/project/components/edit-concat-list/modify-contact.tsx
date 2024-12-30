import { Button, Form, Input, Modal, Radio, Space } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  addClientContact,
  editClientContact,
} from "src/apps/admin/api/client-concat";
import useWather from "src/hooks/use-wather";

type Ref = {
  edit: (item: NonNullable<Client["contact"]>[number]) => Promise<void>;
  create: (id: Client["id"]) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [item, setItem] = useState<NonNullable<Client["contact"]>[number]>();
  const [id, setId] = useState<Client["id"]>();
  const [form] = Form.useForm();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();

        if (item)
          return editClientContact({
            ...store,
            id: item.id,
          });
        if (id) {
          return addClientContact({
            ...store,
            client_id: id,
          });
        }
      })
      .then(() => {
        loading.setTrue();
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  useImperativeHandle(ref, () => ({
    create(id) {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        open.setTrue();
        setId(id);
        setItem(undefined);
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
        setId(undefined);
        form.setFieldsValue(item);
      });
    },
  }));

  return (
    <Modal
      title={item ? "编辑联系人" : "新增联系人"}
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
        labelCol={{ span: 4 }}
        initialValues={{
          is_main: 0,
          status: 1,
        }}
      >
        <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="职位" name="job_title">
          <Input placeholder="请输入职位" />
        </Form.Item>
        <Form.Item label="电话" name="phone" rules={[{ required: true }]}>
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item label="微信" name="wechat">
          <Input placeholder="请输入微信" />
        </Form.Item>
        <Form.Item label="身份证" name="ID_card">
          <Input placeholder="请输入身份证" />
        </Form.Item>
        <Form.Item label="重要联系人" name="is_main">
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group defaultValue={1}>
            <Radio value={1}>有效</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
