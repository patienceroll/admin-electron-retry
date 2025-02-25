import { Button, Form, Input, Modal, Radio, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { EnvironmentFilled } from "@ant-design/icons";
import useWather from "src/hooks/use-wather";
import { addWarehouse, editWarehouse } from "src/apps/admin/api/warehouse";
import * as ChooseAddress from "src/framework/component/choose-address";

type SomeType = Warehouse;

type Ref = {
  edit: (item: SomeType) => Promise<void>;
  create: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const [open] = useWather();

  const [form] = Form.useForm();
  const chooseAddressRef = ChooseAddress.createRef();

  const config = useRef<{
    resolve: () => void;
    reject: (reason?: any) => void;
    title: string;
    item: SomeType | undefined;
  }>({
    reject() {},
    resolve() {},
    title: "",
    item: undefined,
  });

  const [loading] = useWather();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (config.current.item) {
          return editWarehouse({
            ...store,
            id: config.current.item.id,
          });
        }
        return addWarehouse({
          ...store,
        });
      })
      .then(() => {
        loading.setTrue();
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
          title: "新建仓库",
          item: undefined,
        };
        open.setTrue();
        form.resetFields();
      });
    },

    edit(item) {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "编辑仓库",
          item: item,
        };

        open.setTrue();
        form.setFieldsValue(item);
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
          name="name"
          label="仓库"
          rules={[{ required: true, message: "请输入仓库" }]}
        >
          <Input placeholder="请输入仓库" />
        </Form.Item>
        <Form.Item
          label="地址"
          name="address"
          rules={[{ required: true, message: "请输入地址" }]}
        >
          <Input
            placeholder="请输入地址"
            addonAfter={
              <EnvironmentFilled
                onClick={() => {
                  chooseAddressRef.current?.choose().then((res) => {
                    form.setFieldValue("address", res.address);
                  });
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea allowClear placeholder="请输入备注" />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>

      <ChooseAddress.default ref={chooseAddressRef} />
    </Modal>
  );
});
