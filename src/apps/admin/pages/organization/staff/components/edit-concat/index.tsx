import { Form, Input, Modal } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import useWather from "src/hooks/use-wather";
import {
  addBankAccount,
} from "src/apps/admin/api/bank-account";
import { addStaffContact } from "src/apps/admin/api/staff";

type Ref = {
  edit: (item: StaffContact) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (prop, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });
  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [item, setItem] = useState<StaffContact>();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item === undefined) return addStaffContact(store);
        return addBankAccount({ ...store, id: item.id });
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
      return new Promise<void>((resolve, reject) => {
        setItem(undefined);
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
      });
    },
    edit(item) {
      return new Promise<void>((resolve, reject) => {
        setItem(item);
        open.setTrue();
        form.setFieldsValue(item);
        promiseResolver.current = { resolve, reject };
      });
    },
  }));

  return (
    <Modal
      open={open.whether}
      title={item ? "编辑紧急联系人" : "新增紧急联系人"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 4 }}>
        <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="关系" name="relation">
          <Input placeholder="请输入关系" />
        </Form.Item>
        <Form.Item label="工作单位" name="work_unit">
          <Input placeholder="请输入工作单位" />
        </Form.Item>
        <Form.Item label="电话" name="phone" rules={[{ required: true }]}>
          <Input placeholder="请输入电话" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
