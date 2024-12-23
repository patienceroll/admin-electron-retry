import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { addClient, clientNature, editClient } from "src/apps/admin/api/client";
import Icon from "src/framework/component/icon";
import useWather from "src/hooks/use-wather";
import PostionSVG from "src/assets/svg/定位.svg";
import * as ChooseAddress from "src/framework/component/choose-address";

type Ref = {
  edit: (item: Client) => Promise<void>;
  create: () => Promise<void>;
};


export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref, { id: BusinessOpportunity["id"] }>(function (
  props,
  ref
) {
  const { id } = props;
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [item, setItem] = useState<Client>();
  const [form] = Form.useForm();
  const chooseAddressRef = ChooseAddress.createRef();

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();

        if (item) {
          return editClient({
            ...store,

            id: item.id,
          });
        } else {
          return addClient({
            ...store,
            business_opportunity_id: id,
          });
        }
      })
      .then(() => {
        loading.setTrue();
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        open.setTrue();
        form.resetFields();
      });
    },
    edit(item) {
      return new Promise((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };

        open.setTrue();
        setItem(item);
        form.setFieldsValue(item);
      });
    },
  }));

  return (
    <Modal
      title={item ? "编辑单位" : "新增单位"}
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
        labelCol={{ span: 4 }}
        initialValues={{
          is_sign: 0,
          status: 1,
          type: 1,
        }}
      >
        <Form.Item label="单位" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入单位名称" />
        </Form.Item>
        <Form.Item label="简称" name="short_name">
          <Input placeholder="请输入单位简称" />
        </Form.Item>
        <Form.Item label="类型" name="type">
          <Radio.Group>
            <Radio value={1}>施工客户</Radio>
            <Radio value={2}>业主客户</Radio>
            <Radio value={3}>设计院</Radio>
            <Radio value={4}>其他客户</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="性质" name="nature">
          <Select
            options={clientNature.map((item) => ({
              label: item,
              value: item,
            }))}
            allowClear
            placeholder="请选择"
          />
        </Form.Item>
        <Form.Item name="address" label="地址">
          <Input
            placeholder="请输入客户地址"
            addonAfter={
              <Icon
                icon={PostionSVG}
                style={{ cursor: "pointer" }}
                onClick={function () {
                  chooseAddressRef.current?.choose().then((res) => {
                    form.setFieldValue("address", res.address);
                  });
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item label="是否签约" name="is_sign">
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={1}>有效</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <ChooseAddress.default ref={chooseAddressRef} />
    </Modal>
  );
});
