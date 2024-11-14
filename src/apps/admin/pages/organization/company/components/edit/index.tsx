import { Form, Input, Modal, Radio, Select } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import useOption from "src/hooks/use-option";
import { getStaffOption } from "src/apps/admin/api/staff";
import { addCompany, editCompany } from "src/apps/admin/api/company";

type Ref = {
  edit: (item: CompanyListItem) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const EditCompany = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });
  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();
  const [staff] = useOption(getStaffOption);

  const [item, setItem] = useState<CompanyListItem>();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item === undefined) return addCompany(store);
        return editCompany({ ...store, id: item.id });
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

  useEffect(() => {
    if (open.whether) {
      staff.loadOption();
    }
  }, [open.whether, staff]);

  return (
    <Modal
      open={open.whether}
      title={item ? "编辑公司" : "新增公司"}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item
          name="name"
          label="公司"
          rules={[{ required: true, message: "请填写公司" }]}
        >
          <Input placeholder="请输入公司" />
        </Form.Item>
        <Form.Item name="short_name" label="简称">
          <Input placeholder="请输入公司简称" />
        </Form.Item>
        <Form.Item name="staff_id" label="法人">
          <Select
            options={staff.list}
            allowClear
            showSearch
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
            placeholder="请选择公司法人"
          />
        </Form.Item>
        <Form.Item name="is_main" label="是否为总公司">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(EditCompany)``;
