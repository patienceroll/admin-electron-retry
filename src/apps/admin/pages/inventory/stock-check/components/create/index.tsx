import { Button, DatePicker, Form, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";
import { addStockCheck } from "src/apps/admin/api/stock-check";
import { getWarehouseOption } from "src/apps/admin/api/warehouse";
import useOption from "src/hooks/use-option";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

type Ref = {
  create: () => Promise<StockCheckAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: StockCheckAddResponse | PromiseLike<StockCheckAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [project] = useOption(getProjectOption);
  const [salesContract] = useOption(getSalesContractOption);
  const [salesOrder] = useOption(getSalesOrderOption);
  const [warehouse] = useOption(getWarehouseOption);

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();
  const [update] = useUpdate();
  const show = useRef({
    target_show: "",
  });

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        form.resetFields();
        open.setTrue();
        project.params.statuses = [1, 2];
        project.loadOption();
        salesContract.params.statuses = [1, 2];
        salesContract.loadOption();
        salesOrder.params.statuses = [1, 2];
        salesOrder.loadOption();
        warehouse.loadOption();
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addStockCheck({ ...store, ...show.current });
      })
      .then((res) => {
        loading.setTrue();
        promiseResolver.current.resolve(res.data);
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  const contractType = form.getFieldValue("type") || 1;

  return (
    <Modal
      title="新建调拨单"
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
        initialValues={{ type: 1 }}
      >
        <Form.Item name="type" label="类型">
          <Radio.Group onChange={update}>
            <Radio value={1}>仓库</Radio>
            <Radio value={2}>项目</Radio>
            {/*<Radio value={3}>销售合同</Radio>*/}
            <Radio value={4}>销售订单</Radio>
          </Radio.Group>
        </Form.Item>
        {contractType === 1 && (
          <Form.Item
            label="仓库"
            name="target_id"
            rules={[{ required: true, message: "请选择仓库" }]}
          >
            <Select
              options={warehouse.list}
              placeholder="请选择仓库"
              filterOption
              showSearch
              optionFilterProp="name"
              fieldNames={{ label: "name", value: "id" }}
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.target_show = value.name;
                }
              }}
            />
          </Form.Item>
        )}
        {contractType === 2 && (
          <Form.Item label="项目" name="target_id">
            <Select
              options={project.list}
              placeholder="请选择项目"
              fieldNames={{ label: "name", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.target_show = value.name;
                }
              }}
            />
          </Form.Item>
        )}
        {contractType === 3 && (
          <Form.Item label="合同" name="target_id">
            <Select
              options={salesContract.list}
              placeholder="选择销售合同"
              fieldNames={{ label: "name", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.target_show = value.name;
                }
              }}
            />
          </Form.Item>
        )}
        {contractType === 4 && (
          <Form.Item label="销售订单" name="target_id">
            <Select
              options={salesOrder.list}
              placeholder="选择销售订单"
              fieldNames={{ label: "code", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="code"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.target_show = value.code;
                }
              }}
            />
          </Form.Item>
        )}
        <Form.Item
          label="计划开始时间"
          name="plan_start_time"
          rules={[{ required: true, message: "请选择计划开始盘点时间" }]}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            allowClear
            showTime={{
              format: "HH:mm",
              minuteStep: 30,
            }}
            style={{ width: "100%" }}
            placeholder="请选择计划开始盘点时间"
          />
        </Form.Item>
        <Form.Item
          label="计划结束时间"
          name="plan_finish_time"
          rules={[{ required: true, message: "请选择计划盘点结束时间" }]}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            allowClear
            showTime={{
              format: "HH:mm",
              minuteStep: 30,
            }}
            style={{ width: "100%" }}
            placeholder="请选择计划盘点结束时间"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
