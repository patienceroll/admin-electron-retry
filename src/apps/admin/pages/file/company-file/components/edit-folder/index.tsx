import { Form, Input, Modal, Radio } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import { postFolder, putFolder } from "src/apps/admin/api/business-file";

type Ref = {
  edit: (item: Folder) => Promise<void>;
  create: (item: FolderListItem) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const EditFolder = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });
  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [item, setItem] = useState<FolderListItem>();
  const [folder, setFolder] = useState<Folder>();
  const [type, setType] = useState<"新增" | "编辑">("新增");

  useImperativeHandle(ref, () => ({
    create(item) {
      return new Promise<void>((resolve, reject) => {
        setItem(item);
        setFolder(undefined);
        setType("新增");
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
      });
    },
    edit(item) {
      return new Promise<void>((resolve, reject) => {
        setItem(undefined);
        setFolder(item);
        setType("编辑");
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
        if (type === "新增")
          return postFolder({ ...store, pid: item!.current_dir?.id || 0 });
        return putFolder({ ...store, id: folder!.id });
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
      title={type === "编辑" ? "编辑文件夹" : "新建文件夹"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 6 }}
        initialValues={{ is_secret: 0 }}
      >
        <Form.Item label="文件夹" name="name">
          <Input placeholder="请输入文件夹名" />
        </Form.Item>
        <Form.Item label="权限控制" name="is_secret">
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
export default styled(EditFolder)``;
