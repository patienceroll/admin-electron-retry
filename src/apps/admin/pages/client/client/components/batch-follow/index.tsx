import { Col, Modal, Row } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";

import useWather from "src/hooks/use-wather";
import useOption from "src/hooks/use-option";
import { staffTreeOptions } from "src/apps/admin/api/staff";
import * as Item from "./item";
import contextedModal from "src/framework/component/contexted-modal";
import { projectFollowBatchFollow } from "src/apps/admin/api/project-follow";

type Ref = {
  follow: (items: ClientListItem[]) => Promise<void>;
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

const BatchFollow = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() { }, reject() { } });
  const theme = useTheme();

  const map = useRef(
    new Map<ClientListItem["id"], { validate: () => Promise<Record<string, any>> } | null>()
  );

  const [open] = useWather();
  const [loading] = useWather();
  const [options] = useOption(staffTreeOptions);
  const [items, setItems] = useState<ClientListItem[]>([]);

  useImperativeHandle(ref, () => ({
    follow(items) {
      return new Promise((resolve, reject) => {
        promiseResolver.current = { reject, resolve };
        open.setTrue();
        options.loadOption();
        map.current.clear();
        setItems(items);
      });
    },
  }));

  async function submit() {
    Promise.all(
      Array.from(map.current.values()).map((item) => item!.validate())
    ).then((stores) => {
      return new Promise<Record<string, any>[]>((resolve, reject) => {
        contextedModal.modal?.confirm({
          title: "提交审批",
          content: "提交后将直接发起审批,请仔细检查填写的内容是否正确。",
          onOk() {
            resolve(stores)
          },
          onCancel: reject
        })
      })
    }).then(res => {
      loading.setTrue();
      return projectFollowBatchFollow({
        type: 3,
        data: res.map((i, index) => ({
          content: i.content,
          plan_start_time: i.plan_time[0].format("YYYY-MM-DD HH:mm"),
          plan_finish_time: i.plan_time[1].format("YYYY-MM-DD HH:mm"),
          remark: i.remark,
          staff_id: i.staff_id,
          table_id: items[index].id,
        })),
      });
    }).then(() => {
      promiseResolver.current.resolve()
      open.setFalse()
    }).finally(loading.setFalse)
  }


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
          value: item.id,
          selectable: false,
          disabled: true,
          children: children.concat(childPartment),
        };
      });
    }

    return recusion(options.list);
  }, [options.list]);

  return (
    <Modal
      open={open.whether}
      title="批量跟进"
      onClose={open.setFalse}
      onCancel={open.setFalse}
      onOk={submit}
      confirmLoading={loading.whether}
      width="80%"
    >
      <Row gutter={[theme.padding, theme.padding]}>
        {items.map((item) => (
          <Col key={item.id} flex="400px">
            <Item.default
              detail={item}
              staffList={treeOptions}
              onDelete={() => {
                setItems(t => t.filter(i => i.id !== item.id))
                map.current.delete(item.id);
              }}
              ref={(instance) => {
                map.current.set(item.id, instance);
              }}
            />
          </Col>
        ))}
      </Row>
    </Modal>
  );
});

export default styled(BatchFollow)``;
