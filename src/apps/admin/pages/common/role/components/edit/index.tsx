import { Form, Input, Modal, Radio } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import { postRole, putRole } from "src/apps/admin/api/role";

type Ref = {
  edit: (item: RoleListItem) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Edit = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });
  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [item, setItem] = useState<RoleListItem>();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item === undefined) return postRole(store);
        return putRole({ ...store, id: item.id });
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
      title={item ? "编辑角色" : "新增角色"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 5 }}
        initialValues={{ status: 1 }}
      >
        <Form.Item
          name="name"
          label="角色"
          rules={[{ required: true, message: "请输入角色名称" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="标记"
          rules={[{ required: true, message: "请输入" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: "请设置状态" }]}
        >
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Edit)``;
