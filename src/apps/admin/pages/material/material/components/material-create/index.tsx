import { Form, Input, Modal, Radio, TreeSelect } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import useWather from "src/hooks/use-wather";
import { postMaterial } from "src/apps/admin/api/material";

type Response = Awaited<ReturnType<typeof postMaterial>>["data"];

type Ref = {
  create: () => Promise<Response>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref, { classifies: MaterialClassifyTree[] }>(
  function (props, ref) {
    const promiseResolver = useRef<{
      resolve: (data: Response) => void;
      reject: (reason?: unknown) => void;
    }>({ resolve() {}, reject() {} });

    const [form] = Form.useForm();
    const [open] = useWather();
    const [loading] = useWather();

    useImperativeHandle(ref, () => ({
      create() {
        return new Promise<Response>((resolve, reject) => {
          open.setTrue();
          form.resetFields();
          promiseResolver.current = { resolve, reject };
        });
      },
    }));

    function submit() {
      form
        .validateFields()
        .then((store) => {
          loading.setTrue();
          return postMaterial(store);
        })
        .then((res) => {
          promiseResolver.current.resolve(res.data);
          open.setFalse();
          loading.setFalse();
        })
        .catch(loading.setFalse);
    }

    return (
      <Modal
        title="新建物资"
        open={open.whether}
        onCancel={open.setFalse}
        confirmLoading={loading.whether}
        onOk={submit}
      >
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 6 }}
          initialValues={{ status: 1 }}
        >
          <Form.Item name="id" noStyle hidden />

          <Form.Item
            name="material_classify_id"
            label="分类"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <TreeSelect
              showSearch
              treeData={props.classifies}
              placeholder="请选择分类"
              treeNodeFilterProp="name"
              fieldNames={{
                label: "name",
                value: "id",
                children: "child",
              }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input placeholder="请输入物资" />
          </Form.Item>
          <Form.Item name="code" label="编号">
            <Input placeholder="请输入编号" />
          </Form.Item>
          <Form.Item name="brand" label="品牌">
            <Input placeholder="请输入品牌" />
          </Form.Item>
          <Form.Item name="model" label="规格型号">
            <Input placeholder="请输入规格型号" />
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
  }
);
