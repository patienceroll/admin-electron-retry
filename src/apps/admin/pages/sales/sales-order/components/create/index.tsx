import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import useWather from "src/hooks/use-wather";
import { addSalesOrder } from "src/apps/admin/api/sales-order";
import useOption from "src/hooks/use-option";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";

type Ref = {
  create: () => Promise<SalesOrderAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: SalesOrderAddResponse | PromiseLike<SalesOrderAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();
  const [project] = useOption(getProjectOption);
  const [saleContract] = useOption(getSalesContractOption);

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        open.setTrue();
        form.resetFields();
        project.params.statuses = [1, 2];
        project.load();
        saleContract.params.statuses = [1, 2];
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addSalesOrder(store);
      })
      .then((res) => {
        loading.setTrue();
        promiseResolver.current.resolve(res.data);
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  return (
    <Modal
      title="新建订单"
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
      <Form form={form} autoComplete="off" labelCol={{ span: 4 }}>
        <Form.Item
          label="项目"
          name="project_id"
          rules={[{ required: true, message: "请输入项目" }]}
        >
          <Select
            options={project.list}
            placeholder="请选择"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="name"
            onChange={(e) => {
              saleContract.params.project_id = e;
              saleContract.loadOption();
              form.setFieldValue("sales_contract_id", undefined);
            }}
          />
        </Form.Item>
        <Form.Item
          label="合同"
          name="sales_contract_id"
          rules={[{ required: true, message: "请选择销售合同" }]}
        >
          <Select
            options={saleContract.list}
            placeholder="选择销售合同"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="name"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
