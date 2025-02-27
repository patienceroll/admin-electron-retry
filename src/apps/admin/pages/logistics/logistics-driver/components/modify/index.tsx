import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
} from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { getLogisticsCompanyOptions } from "src/apps/admin/api/logistics-company";

import { addDriver, editDriver } from "src/apps/admin/api/logistics-driver";
import useOption from "src/hooks/use-option";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

type Ref = {
  edit: (item: Driver) => Promise<void>;
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
    item: Driver | undefined;
  }>({
    reject() {},
    resolve() {},
    title: "",
    item: undefined,
  });

  const [form] = Form.useForm();
  const [loading] = useWather();
  const [open] = useWather();
  const [update] = useUpdate();
  const [logisticsCompany] = useOption(getLogisticsCompanyOptions);

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (config.current.item)
          return editDriver({ id: config.current.item.id, ...store });
        return addDriver(store);
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
          title: "新建司机",
          item: undefined,
        };
        form.resetFields();
        logisticsCompany.loadOption();
        open.setTrue();
      });
    },

    edit(item) {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "编辑司机",
          item: item,
        };
        form.setFieldsValue(item);
        logisticsCompany.loadOption();
        open.setTrue();
      });
    },
  }));

  const is_own = form.getFieldValue("is_own") === 0 ? 0 : 1;
  
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
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 6 }}
        initialValues={{ status: 1, is_own: 1 }}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: "请输入姓名" }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="本公司" name="is_own">
          <Radio.Group onChange={update}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {is_own === 0 && (
          <Form.Item
            label="物流公司"
            name="logistics_company_id"
            rules={[{ required: true, message: "请选择物流公司" }]}
          >
            <Select
              options={logisticsCompany.list}
              allowClear
              showSearch
              placeholder="请选择物流公司"
              optionFilterProp="name"
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>
        )}
        <Form.Item label="手机号" name="phone">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item label="年龄" name="age">
          <InputNumber min={0} max={150} placeholder="请输入年龄" />
        </Form.Item>
        <Form.Item label="驾龄" name="driver_age">
          <Input placeholder="请输入驾龄" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
