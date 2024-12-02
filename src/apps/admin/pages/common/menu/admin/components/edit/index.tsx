import {
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  TreeSelect,
} from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import { IconMap } from "src/framework/menu";
import {
  addMenuPermission,
  editMenuPermission,
  getMenuTree,
} from "src/apps/admin/api/menu";

type Ref = {
  edit: (item: Menu) => Promise<void>;
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

  const [item, setItem] = useState<Menu>();

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [tree, setTree] = useState<Menu[]>([]);

  function getTree() {
    getMenuTree({ type: 2 }).then((res) => {
      setTree(res.data);
    });
  }

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<void>((resolve, reject) => {
        setItem(undefined);
        getTree();
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
      });
    },
    edit(item) {
      return new Promise<void>((resolve, reject) => {
        setItem(item);
        getTree();
        open.setTrue();
        form.setFieldsValue({
          ...item,
          pid: item.pid === 0 ? undefined : item.pid,
        });
        promiseResolver.current = { resolve, reject };
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item) return editMenuPermission({ id: item.id, ...store });
        return addMenuPermission(store);
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
      title={item ? "编辑菜单" : "新增菜单"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 4 }}
        initialValues={{ company_id: 1, terminal: 2, is_hidden: 0 }}
      >
        <Form.Item label="终端" name="terminal" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={2}>电脑端</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="level" label="级别" rules={[{ required: true }]}>
          <Select
            options={[
              { id: 1, name: "菜单" },
              { id: 2, name: "页面" },
            ].map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            placeholder="请选择目录级别"
          />
        </Form.Item>
        <Form.Item name="pid" label="上级目录">
          <TreeSelect
            allowClear
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={tree}
            placeholder="请选择上级目录"
            treeDefaultExpandAll
            fieldNames={{
              label: "name",
              value: "id",
              children: "child",
            }}
            showSearch
            treeNodeFilterProp="name"
          />
        </Form.Item>
        <Form.Item name="name" label="目录" rules={[{ required: true }]}>
          <Input placeholder="请填写目录名称" />
        </Form.Item>
        <Form.Item name="slug" label="标识" rules={[{ required: true }]}>
          <Input placeholder="请填写目录标识" />
        </Form.Item>
        <Form.Item name="icon" label="图标">
          <Select
            options={Object.keys(IconMap).map((i) => ({
              label: i,
              value: i,
            }))}
          />
        </Form.Item>
        <Form.Item name="path" label="组件路由">
          <Input placeholder="请输入组件路由" />
        </Form.Item>
        <Form.Item name="list" label="排序">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="is_force" label="强制显示">
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Edit)``;
