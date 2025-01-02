import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import useWather from "src/hooks/use-wather";

import {
  addSalesContract,
  getSalesContractOption,
} from "src/apps/admin/api/sales-contract";
import useUpdate from "src/hooks/use-update";
import useOption from "src/hooks/use-option";
import { getProjectOption } from "src/apps/admin/api/project";
import { getClientOption } from "src/apps/admin/api/client";

type Ref = {
  create: () => Promise<SalesContractAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: SalesContractAddResponse | PromiseLike<SalesContractAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [update] = useUpdate();

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const [salesContract] = useOption(getSalesContractOption);
  const [project] = useOption(getProjectOption);
  const [client] = useOption(getClientOption);

  const contractType = form.getFieldValue("type") || 1;

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addSalesContract(store);
      })
      .then((res) => {
        loading.setTrue();
        promiseResolver.current.resolve(res.data);
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        open.setTrue();
        form.resetFields();
        salesContract.params.statuses = [1, 2, 3, 4];
        salesContract.loadOption();
        project.params.statuses = [1, 2];
        project.loadOption();
      });
    },
  }));

  return (
    <Modal
      title="新建机会"
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
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 4 }}
        initialValues={{ status: 0, type: 1 }}
      >
        <Form.Item name="type" label="类型">
          <Radio.Group onChange={update}>
            <Radio value={1}>主合同</Radio>
            <Radio value={2}>补充协议</Radio>
          </Radio.Group>
        </Form.Item>
        {contractType === 2 && (
          <Form.Item
            label="主合同"
            name="pid"
            rules={[{ required: true, message: "请选择主合同" }]}
          >
            <Select
              options={salesContract.list}
              loading={salesContract.loading}
              placeholder="请选择"
              filterOption
              showSearch
              optionFilterProp="name"
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>
        )}
        {contractType === 1 && (
          <>
            <Form.Item
              label="项目"
              name="project_id"
              rules={[{ required: true, message: "请选择项目" }]}
            >
              <Select
                options={project.list}
                loading={project.loading}
                placeholder="请选择"
                fieldNames={{ label: "name", value: "id" }}
                filterOption
                showSearch
                optionFilterProp="name"
                onChange={(e) => {
                  client.params.project_id = e;
                  client.loadOption();
                  form.setFieldsValue({ client_id: undefined });
                }}
              />
            </Form.Item>
            <Form.Item
              label="客户"
              name="client_id"
              rules={[{ required: true, message: "请选择客户" }]}
            >
              <Select
                options={client.list}
                loading={client.loading}
                placeholder="请选择"
                filterOption
                showSearch
                optionFilterProp="name"
                fieldNames={{ label: "name", value: "id" }}
              />
            </Form.Item>
            <Form.Item
              label="合同"
              name="name"
              rules={[{ required: true, message: "请输入合同名称" }]}
            >
              <Input placeholder="请输入合同名称" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
});
