import { Form, Modal, Select } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useOption from "src/hooks/use-option";
import { getRoleOptions } from "src/apps/admin/api/role";
import useWather from "src/hooks/use-wather";
import { postStaffRole } from "src/apps/admin/api/staff";

type Ref = {
  setPermission: (item: StaffListItem) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const EditPermission = forwardRef<Ref>(function (props, ref) {
  const [form] = Form.useForm();
  const [open] = useWather();
  const [loading] = useWather();
  const [role] = useOption(getRoleOptions);


  const [staff, setStaff] = useState<StaffListItem>();

  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return postStaffRole({
          staff_id: staff!.id,
          ...store,
        });
      })
      .then(() => {
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  useImperativeHandle(ref, () => ({
    setPermission(s) {
      return new Promise<void>((resolve, reject) => {
        setStaff(s);
        open.setTrue();
        form.resetFields();
        role.loadOption()
        form.setFieldsValue({ role_ids: s.role.map((i) => i.id) });
        promiseResolver.current = { resolve, reject };
      });
    },
  }));

  return (
    <Modal
      open={open.whether}
      onClose={open.setFalse}
      title="设置员工角色权限"
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off">
        <Form.Item label="角色" name="role_ids" rules={[{ required: true }]}>
          <Select
            options={role.list}
            mode="multiple"
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

export default styled(EditPermission)``;
