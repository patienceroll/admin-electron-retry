import styled, { useTheme } from "styled-components";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Col, Form, Modal, Row, Select, Space } from "antd";
import {
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from "@ant-design/pro-components";

import useWather from "src/hooks/use-wather";
import { addSalesDeliver } from "src/apps/admin/api/sales-deliver";
import useOption from "src/hooks/use-option";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";

type Ref = {
  create: () => Promise<SalesDeliverAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Create = forwardRef<Ref, StyledWrapComponents>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: SalesDeliverAddResponse | PromiseLike<SalesDeliverAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [project] = useOption(getProjectOption);
  const [saleConttact] = useOption(getSalesContractOption);
  const [saleOrder] = useOption(getSalesOrderOption);

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<SalesDeliverAddResponse>((resolve, reject) => {
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
        project.params.statuses = [1, 2];
        project.loadOption();
        saleConttact.params.statuses = [1, 2];
        saleOrder.params.statuses = [1, 2];
      });
    },
  }));

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addSalesDeliver(store);
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
      open={open.whether}
      title="销售发货"
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 5 }}>
        <Form.Item label="项目">
          <Select
            options={project.list}
            placeholder="请选择项目"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="name"
            allowClear
            onChange={(e) => {
              saleConttact.params.project_id = e;
              saleConttact.loadOption();
              form.setFieldValue("sales_contract_id", undefined);
              saleOrder.params.sales_contract_id = undefined;
              form.setFieldValue("sales_order_id", undefined);
            }}
          />
        </Form.Item>
        <Form.Item label="合同" name="sales_contract_id">
          <Select
            allowClear
            options={saleConttact.list}
            loading={saleConttact.loading}
            placeholder="请选择合同"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="name"
            onChange={(e) => {
              saleOrder.params.sales_contract_id = e;
              saleOrder.loadOption();
              form.setFieldValue("sales_order_id", undefined);
            }}
          />
        </Form.Item>
        <Form.Item
          label="销售订单"
          name="sales_order_id"
          rules={[{ required: true }]}
        >
          <Select
            options={saleOrder.list}
            placeholder="选择销售订单"
            fieldNames={{ label: "code", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="code"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Create)``;
