import { Button, Form, Input, Modal, Radio, Space } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import useWather from "src/hooks/use-wather";
import {
  addSupplierContact,
  editSupplierContact,
} from "src/apps/admin/api/supplier-contact";

type Ref = {
  create: () => Promise<void>;
  edit: (params: SupplierContact) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref, { id: Supplier["id"] }>(function (props, ref) {
  const { id } = props;
  const promiseResolver = useRef<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();
  const [item, setItem] = useState<SupplierContact>();

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<void>((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        setItem(undefined);
        open.setTrue();
        form.resetFields();
      });
    },
    edit(params) {
      return new Promise<void>((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        setItem(params);
        open.setTrue();
        form.setFieldsValue(params);
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item) {
          return editSupplierContact({ ...store, id: item.id });
        }
        return addSupplierContact({ ...store, supplier_id: id });
      })
      .then(() => {
        loading.setTrue();
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  return (
    <Modal
      title="新建联系人"
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
        labelCol={{ span: 4 }}
        initialValues={{ status: 1, is_main: 0 }}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: "请输入姓名" }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="职位" name="job_title">
          <Input placeholder="请输入职位" />
        </Form.Item>
        <Form.Item
          label="电话"
          name="phone"
          rules={[{ required: true, message: "请输入电话" }]}
        >
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
        <Form.Item label="备注" name="remark">
          <Input.TextArea allowClear placeholder="请输入备注" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={1}>有效</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
