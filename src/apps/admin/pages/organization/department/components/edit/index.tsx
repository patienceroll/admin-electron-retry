import { Form, Input, Modal, Radio, Select, TreeSelect } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  addDepartment,
  editDepartment,
  getDepartmentTree,
} from "src/apps/admin/api/department";
import { getStaffOption } from "src/apps/admin/api/staff";
import useOption from "src/hooks/use-option";

import useWather from "src/hooks/use-wather";

type Ref = {
  edit: (item: DepartmentListItem) => Promise<void>;
  create: () => Promise<void>;
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
  const [form] = Form.useForm();

  const [item, setItem] = useState<DepartmentListItem>();
  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);
  const [staff] = useOption(getStaffOption);

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item === undefined) return addDepartment(store);
        return editDepartment({ ...store, id: item.id });
      })
      .then(() => {
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  function getTree() {
    getDepartmentTree().then((res) => {
      setDeparmentTree(res.data);
    });
  }

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<void>((resolve, reject) => {
        setItem(undefined);
        open.setTrue();
        form.resetFields();
        getTree();
        staff.loadOption();
        promiseResolver.current = { resolve, reject };
      });
    },
    edit(item) {
      return new Promise<void>((resolve, reject) => {
        setItem(item);
        getTree();
        open.setTrue();
        staff.loadOption();
        form.setFieldsValue(item);
        promiseResolver.current = { resolve, reject };
      });
    },
  }));

  return (
    <Modal
      open={open.whether}
      title={item ? "编辑部门" : "新增部门"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 6 }}
        initialValues={{
          status: 1,
        }}
      >
        <Form.Item label="上级部门" name="pid">
          <TreeSelect
            allowClear
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={deparmentTree}
            placeholder="请选择上级部门"
            treeDefaultExpandAll
            fieldNames={{
              children: "child",
              label: "name",
              value: "id",
            }}
            showSearch
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <Form.Item
          label="部门"
          name="name"
          rules={[{ required: true, message: "请输入部门" }]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item label="负责人" name="staff_id">
          <Select
            options={staff.list}
            allowClear
            showSearch
            placeholder="请选择"
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
          />
        </Form.Item>
        <Form.Item label="职责" name="remark">
          <Input.TextArea
            allowClear
            style={{ height: 200 }}
            placeholder="请输入部门职责"
          />
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
