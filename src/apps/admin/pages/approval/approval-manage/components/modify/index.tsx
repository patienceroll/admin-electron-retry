import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";


import { getApprovalOptions } from "src/apps/admin/api/approval";
import { getJobOptions } from "src/apps/admin/api/job";
import {
  addLogisticsCompany,
  editLogisticsCompany,
} from "src/apps/admin/api/logistics-company";
import useOption from "src/hooks/use-option";
import useWather from "src/hooks/use-wather";
import Workflow from "../workflow";

type Ref = {
  edit: (item: Approval) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const config = useRef<{
    resolve: () => void;
    reject: (reason?: any) => void;
    title: string;
    item: Approval | undefined;
  }>({
    reject() {},
    resolve() {},
    title: "",
    item: undefined,
  });

  const [form] = Form.useForm();
  const [loading] = useWather();
  const [open] = useWather();

  const [job] = useOption(getJobOptions);
  const [approvalConfig] = useOption(getApprovalOptions);

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (config.current.item)
          return editLogisticsCompany({ id: config.current.item.id, ...store });
        return addLogisticsCompany(store);
      })
      .then(() => {
        config.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "新建流程",
          item: undefined,
        };
        open.setTrue();
        job.loadOption();
        approvalConfig.loadOption();
        form.resetFields();
      });
    },

    edit(item) {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "编辑流程",
          item: item,
        };
        open.setTrue();
        job.loadOption();
        approvalConfig.loadOption();
        form.setFieldsValue({
          ...item,
          staff_ids: item.note?.map(item => item.staff_id)
        });
      });
    },
  }));

  return (
    <Modal
      title={config.current.title}
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={open.setFalse}
      footer={
        <Space>
          <Button onClick={open.setFalse} disabled={loading.whether}>
            关闭
          </Button>
          <Button type="primary" loading={loading.whether} onClick={submit}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item
          name="table"
          label="审批业务"
          rules={[{ required: true, message: "请选择审批业务" }]}
        >
          <Select
            options={approvalConfig.list}
            allowClear
            showSearch
            placeholder="请选择审批业务"
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "key" }}
            filterOption
          />
        </Form.Item>
        <Form.Item
          name="job_id"
          label="发起人职位"
          rules={[{ required: true, message: "请选择发起人职位" }]}
        >
          <Select
            options={job.list}
            allowClear
            showSearch
            placeholder="请选择发起人职位"
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: "请输入审批名称" }]}
        >
          <Input placeholder="请输入审批名称" />
        </Form.Item>
        <Form.Item
          name="staff_ids"
          label="审批流程"
          rules={[{ required: true, message: "请创建流程" }]}
        >
          <Workflow />
        </Form.Item>
      </Form>
    </Modal>
  );
});
