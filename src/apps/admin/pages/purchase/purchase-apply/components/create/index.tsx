import { Button, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { addPurchaseApply } from "src/apps/admin/api/purchase-apply";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

type Ref = {
  create: () => Promise<PurchaseApplyAddResponse>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: (
      value: PurchaseApplyAddResponse | PromiseLike<PurchaseApplyAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [update] = useUpdate();

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
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return addPurchaseApply(store);
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
      title="新建采购申请"
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
        initialValues={{ is_urgent: 0 }}
      >
        <Form.Item label="申请类型" name="type">
          <Radio.Group onChange={update}>
            <Radio value={1}>大宗物资</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="is_urgent" label="是否加急">
          <Radio.Group defaultValue={0}>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
