import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Modal, Form, TreeSelect, Input, Radio, Checkbox } from "antd";

import useWather from "src/hooks/use-wather";
import {
  getMaterialClassify,
  postMaterialClassify,
  putMaterialClassify,
} from "src/apps/admin/api/marterial-classify";
import useOption from "src/hooks/use-option";
import { getMaterialAttrs } from "src/apps/admin/api/material-attr";

type Ref = {
  edit: (item: MaterialClassifyTree) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref, { classifies: MaterialClassifyTree[] }>(
  function (props, ref) {
    const promiseResolver = useRef<{
      resolve: () => void;
      reject: (reason?: unknown) => void;
    }>({ resolve() {}, reject() {} });
    const [form] = Form.useForm();
    const [open] = useWather();
    const [loading] = useWather();
    const [item, setItem] = useState<MaterialClassifyTree>();

    const [attrs] = useOption(getMaterialAttrs);

    useImperativeHandle(ref, () => ({
      create() {
        return new Promise<void>((resolve, reject) => {
          setItem(undefined);
          open.setTrue();
          form.resetFields();
          attrs.loadOption();
          promiseResolver.current = { resolve, reject };
        });
      },
      edit(item) {
        return new Promise<void>((resolve, reject) => {
          setItem(item);
          open.setTrue();
          getMaterialClassify({ id: item.id }).then((res) => {
            form.setFieldsValue({
              ...res.data,
              pid: item.pid === 0 ? undefined : item.pid,
              attr_ids: res.data.material_attr.map(
                (item) => item.material_attr_id
              ),
            });
          });

          attrs.loadOption();
          promiseResolver.current = { resolve, reject };
        });
      },
    }));

    function submit() {
      form
        .validateFields()
        .then((store) => {
          loading.setTrue();
          if (item) {
            return putMaterialClassify({
              ...store,
              id: item.id,
            });
          }
          return postMaterialClassify({
            ...store,
          });
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
        title={item ? "编辑分类" : "新建分类"}
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
          <Form.Item name="pid" label="父级分类">
            <TreeSelect
              showSearch
              treeData={props.classifies}
              placeholder="请选择父级分类"
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
            rules={[{ required: true, message: "请输入分类" }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="编号"
            rules={[{ required: true, message: "请输入分类编号" }]}
          >
            <Input placeholder="请输入分类编号" />
          </Form.Item>
          <Form.Item name="attr_ids" label="属性">
            <Checkbox.Group>
              {attrs.list.map((item) => (
                <Checkbox value={item.id}>{item.name}</Checkbox>
              ))}
            </Checkbox.Group>
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
