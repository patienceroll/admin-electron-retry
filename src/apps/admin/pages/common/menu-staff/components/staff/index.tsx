import { Form, Modal, TreeSelect } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import useWather from "src/hooks/use-wather";
import styled from "styled-components";

import { setMenuStaff } from "src/apps/admin/api/menu";
import { staffTreeOptions } from "src/apps/admin/api/staff";
import useOption from "src/hooks/use-option";

type Ref = {
  edit: (item: Menu) => Promise<void>;
};

type OptionsUseForTreeSelect = {
  title?: React.ReactNode;
  value?: string | number;
  children?: OptionsUseForTreeSelect[];
  selectable?: boolean;
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
  const [options] = useOption(staffTreeOptions);

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const treeOptions = useMemo(() => {
    function recusion(data: StaffTreeOption[]): OptionsUseForTreeSelect[] {
      return data.map((item) => {
        const children: OptionsUseForTreeSelect[] = [];
        if (item.employee instanceof Array) {
          item.employee.forEach((emp) => {
            children.push({ title: emp.name, value: emp.id });
          });
        }

        const childPartment = recusion(item.child || []);

        return {
          title: item.name,
          value: `${Math.random()}`,
          selectable: false,
          disabled: true,
          children: children.concat(childPartment),
        };
      });
    }

    return recusion(options.list);
  }, [options.list]);

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
