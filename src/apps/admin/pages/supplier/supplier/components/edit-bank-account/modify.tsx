import { Button, Form, Input, Modal, Radio, Space } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import useWather from "src/hooks/use-wather";

import {
  addBankAccount,
  editBankAccount,
} from "src/apps/admin/api/bank-account";
import Icon from "src/framework/component/icon";
import PostionSVG from "src/assets/svg/定位.svg";
import * as ChooseAddress from "src/framework/component/choose-address";

type Ref = {
  create: () => Promise<void>;
  edit: (params: BankAccount) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref, { id: Supplier["id"] }>(function (props, ref) {
  const { id } = props;
  const promiseResolver = useRef<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();
  const [item, setItem] = useState<BankAccount>();
  const chooseAddressRef = ChooseAddress.createRef();

  useImperativeHandle(ref, () => ({
    create() {
      return new Promise<void>((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        setItem(undefined);
        open.setTrue();
        form.resetFields();
      });
    },
    edit(params) {
      return new Promise<void>((resolve, reject) => {
        promiseResolver.current = {
          reject,
          resolve,
        };
        setItem(params);
        open.setTrue();
        form.setFieldsValue(params);
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item) {
          return editBankAccount({ ...store, id: item.id, type: 3 });
        }
        return addBankAccount({
          ...store,
          table_id: id,
          type: 3,
          table: "supplier",
        });
      })
      .then(() => {
        loading.setTrue();
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  return (
    <Modal
      title="新建联系人"
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
        labelCol={{ span: 4 }}
        initialValues={{ status: 1 }}
      >
        <Form.Item
          label="公司名称"
          name="company_name"
          rules={[{ required: true, message: "请输入公司名称" }]}
        >
          <Input placeholder="请输入公司名称" />
        </Form.Item>
        <Form.Item
          label="公司地址"
          name="company_address"
          rules={[{ required: true, message: "请输入公司地址" }]}
        >
          <Input
            placeholder="请输入公司地址"
            addonAfter={
              <Icon
                icon={PostionSVG}
                style={{ cursor: "pointer" }}
                onClick={function () {
                  chooseAddressRef.current?.choose().then((res) => {
                    form.setFieldValue("company_address", res.address);
                  });
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item
          label="联系人"
          name="linkman"
          rules={[{ required: true, message: "请输入联系人" }]}
        >
          <Input placeholder="请输入联系人" />
        </Form.Item>
        <Form.Item label="电话" name="phone">
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item label="银行" name="bank_name">
          <Input placeholder="请输入银行" />
        </Form.Item>
        <Form.Item label="开户行" name="bank_address">
          <Input placeholder="请输入开户行" />
        </Form.Item>
        <Form.Item label="税号" name="tax_code">
          <Input placeholder="请输入税号" />
        </Form.Item>
        <Form.Item label="账号" name="account">
          <Input placeholder="请输入账号" />
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
