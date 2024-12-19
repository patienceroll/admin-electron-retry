import { ProTable } from "@ant-design/pro-components";
import React, { useCallback, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Button, FloatButton, Space, Tag } from "antd";

import useWather from "src/hooks/use-wather";
import { deleteMenu, getMenuTree } from "src/apps/admin/api/menu";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import Icon from "src/framework/component/icon";
import { IconMap } from "src/framework/menu";
import AddSvg from "src/assets/svg/add.svg";
import * as Edit from "./components/edit";
import * as Permission from "./components/permission";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";

type Data = Omit<Menu, "child"> & { children?: Data[] };

function Admin() {
  const [loading] = useWather();
  const [dataSource, setDataSource] = useState<Data[]>([]);
  const theme = useTheme();
  
  const ref = Edit.createRef();
  const permission = Permission.createRef();

  const load = useCallback(
    function () {
      loading.setTrue();
      getMenuTree({ type: 2 })
        .then((res) => {
          function deep(item: Menu[]): Data[] {
            return item.map((i) => ({
              ...i,
              children:
                i.child && i.child.length !== 0 ? deep(i.child) : undefined,
            }));
          }
          setDataSource(deep(res.data));
        })
        .finally(loading.setFalse);
    },
    [loading]
  );

  useEffect(() => {
    load();
  }, [load]);

  const column = tableColumn<Data>([
    {
      title: "菜单",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "图标",
      dataIndex: "icon",
      render: (_, row) => {
        if (!row.icon) return "-";
        return <Icon icon={IconMap[row.icon as keyof typeof IconMap]} />;
      },
    },
    {
      title: "级别",
      dataIndex: "level",
      valueEnum: new Map(
        [
          {
            text: "菜单",
            value: 1,
            color: "blue",
          },
          {
            text: "页面",
            value: 2,
            color: "success",
          },
        ].map((i) => [
          i.value,
          <Tag color={i.color} key={i.value}>
            {i.text}
          </Tag>,
        ])
      ),
    },
    {
      title: "标识",
      dataIndex: "slug",
      width: 200,
    },
    {
      title: "路由",
      dataIndex: "path",
      width: 200,
    },
    {
      title: "强制显示",
      dataIndex: "is_force",
      valueEnum: new Map([
        [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "否" }],
        [1, { value: 1, color: "green", text: "是" }],
      ]),
    },
    {
      title: "操作",
      dataIndex: "id",
      width: 250,
      fixed: "right",
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={() => {
                ref.current?.edit(row).then(function () {
                  load();
                  contextedMessage.message?.success("成功编辑菜单");
                });
              }}
            >
              编辑
            </Button>
            <Button
              type="text"
              onClick={function () {
                permission.current?.show(row);
              }}
            >
              权限
            </Button>
            <Button
              type="text"
              danger
              onClick={function () {
                contextedModal.modal?.confirm({
                  title: "删除",
                  content: `确定删除${row.name}?`,
                  onOk() {
                    return deleteMenu({ id: row.id }).then(() => {
                      contextedMessage.message?.success("成功删除");
                      load();
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

  return (
    <>
      <ProTable
        rowKey="id"
        search={false}
        loading={loading.whether}
        pagination={false}
        dataSource={dataSource}
        size="small"
        options={false}
        scroll={{ x: tableMeasureColumnWidth(column) }}
        columns={column}
      />
      <Edit.default ref={ref} />
      <Permission.default ref={permission} />
      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建菜单"
          icon={<Icon  icon={AddSvg} />}
          onClick={() => {
            ref.current?.create().then(function () {
              load();
              contextedMessage.message?.success("成功新增菜单");
            });
          }}
        />
      </FloatButton.Group>
    </>
  );
}

export default styled(Admin)``;
