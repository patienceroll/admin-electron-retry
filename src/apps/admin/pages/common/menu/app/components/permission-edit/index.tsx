import { Form, Input, InputNumber, Modal } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import { postPermission, putPermission } from "src/apps/admin/api/menu";

type Ref = {
  edit: (item: Permission) => Promise<void>;
  create: (menu: Menu) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Edit = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [item, setItem] = useState<Permission>();
  const [menu, setMenu] = useState<Menu>();

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    create(menu) {
      return new Promise<void>((resolve, reject) => {
        setItem(undefined);
        setMenu(menu);
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
      });
    },
    edit(item) {
      return new Promise<void>((resolve, reject) => {
        setItem(item);
        setMenu(undefined);
        open.setTrue();
        form.setFieldsValue(item);
        promiseResolver.current = { resolve, reject };
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item) return putPermission({ id: item.id, ...store });
        return postPermission({ menu_id: menu!.id, ...store });
      })
      .then(() => {
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  return (
    <Modal
      open={open.whether}
      title={item ? "编辑权限" : "新增权限"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item name="name" label="权限">
          <Input placeholder="请输入权限" />
        </Form.Item>
        <Form.Item name="slug" label="标识">
          <Input placeholder="请输入标识" />
        </Form.Item>
        <Form.Item name="list" label="排序">
          <InputNumber placeholder="请输入排序" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Edit)``;
