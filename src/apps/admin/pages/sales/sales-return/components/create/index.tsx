import styled from "styled-components";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Form, Modal, Select } from "antd";

import useWather from "src/hooks/use-wather";
import { getSalesDeliverOption } from "src/apps/admin/api/sales-deliver";
import useOption from "src/hooks/use-option";

import { addSalesReturn } from "src/apps/admin/api/sales-return";

type Response = Awaited<ReturnType<typeof addSalesReturn>>["data"];
type Ref = {
  create: () => Promise<Response>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Create = forwardRef<Ref, StyledWrapComponents>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (value: Response | PromiseLike<Response>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [salesDeliver] = useOption(getSalesDeliverOption);

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<Response>((resolve, reject) => {
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
        salesDeliver.params.status = 3;
        salesDeliver.loadOption();
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
        return addSalesReturn(store);
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
      title="销售退货"
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 5 }}>
        <Form.Item
          label="销售发货"
          name="sales_deliver_id"
          rules={[{ required: true }]}
        >
          <Select
            options={salesDeliver.list}
            placeholder="选择销售发货"
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
