import { Button, Form, Modal, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { addOutStock } from "src/apps/admin/api/out-stock";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";
import { getWarehouseOption } from "src/apps/admin/api/warehouse";
import useOption from "src/hooks/use-option";
import useWather from "src/hooks/use-wather";

type Ref = {
  create: () => Promise<OutStockAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: OutStockAddResponse | PromiseLike<OutStockAddResponse>
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
        return addOutStock(store);
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
      title="新建出库单"
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
        <Form.Item label="项目" name="project_id">
          <Select
            options={project.list}
            placeholder="请选择项目"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="name"
          />
        </Form.Item>
        <Form.Item label="销售合同" name="sales_contract_id">
          <Select
            options={salesContract.list}
            placeholder="选择销售合同"
            fieldNames={{ label: "name", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="code"
          />
        </Form.Item>
        <Form.Item label="销售订单" name="sales_order_id">
          <Select
            options={salesOrder.list}
            placeholder="选择销售订单"
            fieldNames={{ label: "code", value: "id" }}
            filterOption
            showSearch
            optionFilterProp="code"
          />
        </Form.Item>
        <Form.Item
          label="仓库"
          name="warehouse_id"
          rules={[{ required: true, message: "请选择仓库" }]}
        >
          <Select
            options={warehouse.list}
            placeholder="请选择"
            filterOption
            showSearch
            optionFilterProp="name"
            fieldNames={{ label: "name", value: "id" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
