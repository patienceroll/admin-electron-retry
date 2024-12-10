import { Form, Input, Modal, Radio, Select } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import { addClient } from "src/apps/admin/api/client";
import AddressFormInput from "src/framework/component/address-form-input";

type Ref = {
  create: () => Promise<ClientAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Create = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: ClientAddResponse | PromiseLike<ClientAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<ClientAddResponse>((resolve, reject) => {
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

        return addClient({
          ...store,
          // province: choosedAddressValue.current?.district[0].text,
          // city: choosedAddressValue.current?.district[1].text,
          // county: choosedAddressValue.current?.district[2].text,
          // latitude: choosedAddressValue.current?.address.location.lat,
          // longitude: choosedAddressValue.current?.address.location.lng,
        });
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
      title="新建客户"
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 4 }}
        initialValues={{ status: 0, is_sign: 0 }}
      >
        <Form.Item label="客户" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入客户" />
        </Form.Item>
        <Form.Item label="简称" name="short_name" rules={[{ required: true }]}>
          <Input placeholder="请输入简称" />
        </Form.Item>
        <Form.Item label="类型" name="type" rules={[{ required: true }]}>
          <Select
            options={[
              {
                label: "施工单位",
                value: 1,
              },
              {
                label: "业主单位",
                value: 2,
              },
              {
                label: "设计院",
                value: 3,
              },
              {
                label: "其他单位",
                value: 4,
              },
            ]}
            allowClear
            placeholder="请选择客户类型"
          />
        </Form.Item>
        <Form.Item
          label="地址"
          name="address"
          rules={[{ required: true, message: "请搜索地址" }]}
        >
          <AddressFormInput />
        </Form.Item>
        <Form.Item label="性质" name="nature" rules={[{ required: true }]}>
          <Input placeholder="请输入性质" />
        </Form.Item>
        <Form.Item label="是否签约" name="is_sign">
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={0}>停用</Radio>
            <Radio value={1}>启用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Create)``;
