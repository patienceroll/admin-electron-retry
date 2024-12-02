import { Button, Modal, Space } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";
import { ProTable } from "@ant-design/pro-components";

import useWather from "src/hooks/use-wather";
import {
  deletePermission,
  getPermissionsOption,
} from "src/apps/admin/api/menu";
import useOption from "src/hooks/use-option";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";
import * as Edit from "../permission-edit"


type Ref = {
  show: (item: Menu) => void;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Permisson = forwardRef<Ref>(function (props, ref) {
  const [open] = useWather();
  const [option] = useOption(getPermissionsOption);
  const theme = useTheme();

  const edit = Edit.createRef()

  const [item, setItem] = useState<Menu>();

  const column = tableColumn<Permission>([
    {
      title: "权限",
      dataIndex: "name",
    },
    {
      title: "标识",
      dataIndex: "slug",
    },
    {
      title: "操作",
      render(_, row) {
        return (
          <Space>
            <Button type="text" onClick={() => {}}>
              编辑
            </Button>

            <Button
              type="text"
              danger
              onClick={function () {
                contextedModal.modal?.confirm({
                  title: "删除",
                  content: `确定删除${row.name}?`,
                  onOk() {
                    return deletePermission({ id: row.id }).then(() => {
                      contextedMessage.message?.success("成功删除");
                      option.loadOption();
                    });
                  },
                });
              }}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ]);

  useImperativeHandle(ref, () => ({
    show(item) {
      setItem(item);
      option.params.menu_id = item.id;
      option.loadOption();
      open.setTrue();
    },
  }));

  return (
    <Modal
      open={open.whether}
      title={`${item?.name}菜单权限`}
      onClose={open.setFalse}
      onCancel={open.setFalse}
      footer={
        <Space>
          <Button type="primary">新增权限</Button>
        </Space>
      }
    >
      <ProTable
        rowKey="id"
        style={{ marginTop: theme.margin }}
        search={false}
        loading={option.loading}
        options={false}
        dataSource={option.list}
        pagination={false}
        columns={column}
        scroll={{ x: tableMeasureColumnWidth(column) }}
      />
      <Edit.default ref={edit} />
    </Modal>
  );
});

export default styled(Permisson)``;
