import { Col, Modal, Row } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";

import useWather from "src/hooks/use-wather";

import * as Item from "./item";
import contextedModal from "src/framework/component/contexted-modal";
import { projectFollowBatchFollow } from "src/apps/admin/api/project-follow";
import useStaffTree from "src/b-hooks/use-staff-tree";

type Ref = {
  follow: (items: Client[]) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const BatchFollow = forwardRef<Ref>(function (props, ref) {
  const promiseResolver = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });
  const theme = useTheme();

  const map = useRef(
    new Map<
      Client["id"],
      { validate: () => Promise<Record<string, any>> } | null
    >()
  );

  const [open] = useWather();
  const [loading] = useWather();
  const [items, setItems] = useState<Client[]>([]);

  const { options, treeOptions } = useStaffTree();

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
    )
      .then((stores) => {
        return new Promise<Record<string, any>[]>((resolve, reject) => {
          contextedModal.modal?.confirm({
            title: "提交审批",
            content: "提交后将直接发起审批,请仔细检查填写的内容是否正确。",
            onOk() {
              resolve(stores);
            },
            onCancel: reject,
          });
        });
      })
      .then((res) => {
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
      })
      .then(() => {
        promiseResolver.current.resolve();
        open.setFalse();
      })
      .finally(loading.setFalse);
  }

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
                setItems((t) => t.filter((i) => i.id !== item.id));
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
