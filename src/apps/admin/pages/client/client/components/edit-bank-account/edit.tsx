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
  edit: (item: BankAccount) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref, Pick<ClientListItem, "id">>(function (
  props,
  ref
) {
  const { id } = props;
  const [open] = useWather();
  const [loading] = useWather();

  const [form] = Form.useForm();
  const [item, setItem] = useState<BankAccount>();

  const chooseAddressRef = ChooseAddress.createRef();

  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        if (item) {
          return editBankAccount({
            ...store,
            id: item.id,
            type: 2,
            province: store.company_address.province,
            city: store.company_address.city,
            county: store.company_address.county,
            latitude: store.company_address.lat,
            longitude: store.company_address.lng,
            company_address: store.company_address.address,
          });
        }
        return addBankAccount({
          ...store,
          table_id: id,
          type: 2,
          table: "client",
          province: store.company_address.province,
          city: store.company_address.city,
          county: store.company_address.county,
          latitude: store.company_address.lat,
          longitude: store.company_address.lng,
          company_address: store.company_address.address,
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
      title={item ? "编辑账户" : "新增账户"}
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
          label="公司名称"
          name="company_name"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入公司名称" />
        </Form.Item>
        <Form.Item
          label="公司地址"
          name="company_address"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="请输入地址"
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
        <Form.Item label="联系人" name="linkman" rules={[{ required: true }]}>
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
          <Radio.Group defaultValue={1}>
            <Radio value={1}>有效</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>

      <ChooseAddress.default ref={chooseAddressRef} />
    </Modal>
  );
});
