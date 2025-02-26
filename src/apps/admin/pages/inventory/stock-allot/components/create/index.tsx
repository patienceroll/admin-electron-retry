import { Button, Form, Modal, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { addOutStock } from "src/apps/admin/api/out-stock";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";
import { addStockAllot } from "src/apps/admin/api/stock-allot";
import { getWarehouseOption } from "src/apps/admin/api/warehouse";
import useOption from "src/hooks/use-option";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

type Ref = {
  create: () => Promise<StockAllotAddRes>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (value: StockAllotAddRes | PromiseLike<StockAllotAddRes>) => void;
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
    in_show: "",
    out_show: "",
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
        return addStockAllot({ ...store, ...show.current });
      })
      .then((res) => {
        loading.setTrue();
        promiseResolver.current.resolve(res.data);
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  const type = form.getFieldValue("type") || 1;

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
      <Form form={form} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item
          label="类型"
          name="type"
          rules={[{ required: true, message: "请选择" }]}
        >
          <Select
            placeholder="请选择调拨类型"
            onChange={() => {
              update();
              form.setFieldValue("out_id", undefined);
              form.setFieldValue("in_id", undefined);
            }}
            options={[
              { label: "仓库 -> 仓库", value: 1 },
              { label: "仓库 -> 项目", value: 5 },
              { label: "仓库 -> 销售订单", value: 7 },
              { label: "项目 -> 项目", value: 2 },
              { label: "项目 -> 仓库", value: 6 },
              { label: "销售订单 -> 销售订单", value: 4 },
              { label: "销售订单 -> 仓库", value: 8 },
            ]}
          />
        </Form.Item>
        {[1, 5, 7].includes(type) && (
          <Form.Item
            label="调出仓库"
            name="out_id"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              options={warehouse.list}
              placeholder="请选择仓库"
              fieldNames={{ label: "name", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.out_show = value.name;
                }
              }}
            />
          </Form.Item>
        )}
        {[2, 6].includes(type) && (
          <Form.Item
            label="调出项目"
            name="out_id"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              options={project.list}
              placeholder="请选择项目"
              fieldNames={{ label: "name_show", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.out_show = value.name_show;
                }
              }}
            />
          </Form.Item>
        )}
        {[4, 8].includes(type) && (
          <Form.Item
            label="调出销售订单"
            name="out_id"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              options={salesOrder.list}
              placeholder="请选择销售订单"
              fieldNames={{ label: "code", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.out_show = value.code;
                }
              }}
            />
          </Form.Item>
        )}
        {[1, 6, 8].includes(type) && (
          <Form.Item
            label="调入仓库"
            name="in_id"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              options={warehouse.list}
              placeholder="请选择仓库"
              fieldNames={{ label: "name", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.in_show = value.name;
                }
              }}
            />
          </Form.Item>
        )}

        {[2, 5].includes(type) && (
          <Form.Item
            label="调入项目"
            name="in_id"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              options={project.list}
              placeholder="请选择项目"
              fieldNames={{ label: "name_show", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.in_show = value.name_show;
                }
              }}
            />
          </Form.Item>
        )}
        {[4, 7].includes(type) && (
          <Form.Item
            label="调入销售订单"
            name="in_id"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              options={salesOrder.list}
              placeholder="请选择销售订单"
              fieldNames={{ label: "code", value: "id" }}
              filterOption
              showSearch
              optionFilterProp="name"
              onChange={(_, value) => {
                if (value && !(value instanceof Array)) {
                  show.current.in_show = value.code;
                }
              }}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
});
