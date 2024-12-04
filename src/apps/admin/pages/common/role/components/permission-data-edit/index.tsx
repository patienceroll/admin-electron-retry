import { Form, Modal, TreeSelect } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import { getDepartmentTree } from "src/apps/admin/api/department";
import { postRoleDataPermission } from "src/apps/admin/api/role";

type SomeType = {
  role: RoleListItem;
  roleMenu: RoleMenu;
};

type Ref = {
  edit: (item: SomeType) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Edit = forwardRef<Ref>(function (props, ref) {
  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);
  const [item, setItem] = useState<SomeType>();

  function getTree() {
    getDepartmentTree().then((res) => {
      setDeparmentTree(res.data);
    });
  }

  useImperativeHandle(ref, () => ({
    edit(item) {
      return new Promise((resolve, reject) => {
        promiseResolver.current = { reject, resolve };
        setItem(item);
        open.setTrue();
        getTree();
        form.setFieldsValue({
          department_ids: item.roleMenu.data_permission.map(
            (i) => i.department_id
          ),
        });
      });
    },
  }));

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();

        if (item) {
          return postRoleDataPermission({
            role_id: item.role.id,
            menu_id: item.roleMenu.id,
            department_ids: store.department_ids,
          });
        }
        return Promise.reject();
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
      title="编辑数据权限"
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={open.setFalse}
      onOk={submit}
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item label="选择部门" name="department_ids">
          <TreeSelect
            placeholder="请选择部门"
            fieldNames={{
              value: "id",
              label: "name",
              children: "child",
            }}
            multiple
            treeData={deparmentTree}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Edit)``;
