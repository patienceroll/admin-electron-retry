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
  editBankAccount,
} from "src/apps/admin/api/bank-account";

type Ref = {
  edit: (item: BankAccount) => Promise<void>;
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

  const [item, setItem] = useState<BankAccount>();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item === undefined) return editBankAccount(store);
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
      title={item ? "编辑账户" : "新增账户"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 4 }}>
        <Form.Item
          label="银行"
          name="bank_name"
          rules={[{ required: true, message: "请输入银行" }]}
        >
          <Input placeholder="请请输入银行" />
        </Form.Item>
        <Form.Item label="开户行" name="bank_address">
          <Input placeholder="请输入开户行" />
        </Form.Item>
        <Form.Item
          label="账号"
          name="account"
          rules={[{ required: true, message: "请输入账号" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
