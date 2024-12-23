import { Form, Modal, TreeSelect } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useWather from "src/hooks/use-wather";
import styled from "styled-components";

import { setMenuStaff } from "src/apps/admin/api/menu";

import useStaffTree from "src/b-hooks/use-staff-tree";

type Ref = {
  edit: (item: Menu) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Department = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [item, setItem] = useState<Menu>();
  const { options, treeOptions } = useStaffTree();

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    edit(item) {
      return new Promise((resolve, reject) => {
        setItem(item);
        open.setTrue();
        promiseResolver.current = { resolve, reject };
        options.loadOption();
        form.setFieldsValue({
          department_ids: item.menu_department?.map((i) => i.department_id),
        });
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return setMenuStaff({ id: item?.id, ...store });
      })
      .then(() => {
        promiseResolver.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(loading.setFalse);
  }

  return (
    <Modal
      open={open.whether}
      title="设置目录人员范围"
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item label="人员" name="staff_ids">
          <TreeSelect
            placeholder="请选择人员"
            treeNodeFilterProp="title"
            treeData={treeOptions}
            multiple
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Department)``;
