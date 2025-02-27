import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
} from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";


import { getLogisticsCompanyOptions } from "src/apps/admin/api/logistics-company";
import {
  addLogisticsContract,
  editLogisticsContract,
} from "src/apps/admin/api/logistics-contract";

import { getDriverOptions } from "src/apps/admin/api/logistics-driver";
import useOption from "src/hooks/use-option";
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
  const [logisticsCompany] = useOption(getLogisticsCompanyOptions);
  const [driver] = useOption(getDriverOptions);

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (config.current.item)
          return editLogisticsContract({
            id: config.current.item.id,
            ...store,
          });
        return addLogisticsContract(store);
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
          title: "新建合同",
          item: undefined,
        };
        form.resetFields();
        logisticsCompany.loadOption();
        driver.loadOption();
        open.setTrue();
      });
    },

    edit(item) {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "编辑合同",
          item: item,
        };
        form.setFieldsValue(item);
        driver.loadOption();
        logisticsCompany.loadOption();
        open.setTrue();
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
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 6 }}
        initialValues={{ status: 1 }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="编号"
          name="code"
          rules={[{ required: true, message: "请输入编号" }]}
        >
          <Input placeholder="请输入编号" />
        </Form.Item>
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
        <Form.Item
          label="司机"
          name="driver_id"
          rules={[{ required: true, message: "请选择司机" }]}
        >
          <Select
            options={driver.list}
            allowClear
            showSearch
            placeholder="请选择司机"
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "id" }}
          />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请输入备注" />
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
