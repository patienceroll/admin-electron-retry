import React, { useEffect } from "react";
import { Affix, Button, Card, FloatButton, Space, Typography } from "antd";
import styled, { useTheme } from "styled-components";
import { ProFormText, ProTable, QueryFilter } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import { getClientList, StaffStatus } from "src/apps/admin/api/client";
import { projectTypeMap } from "src/apps/admin/api/project";
import { watherMap } from "src/apps/admin/api/general";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import * as Create from "./components/create";
import contextedMessage from "src/framework/component/contexted-message";
import openWindow from "src/util/open-window";

function Client() {
  const table = useSearchTable(getClientList);
  const theme = useTheme();

  const create = Create.createRef();

  const column = table.column([
    {
      title: "客户",
      dataIndex: "name",
      fixed: "left",
      width: 200,
      render: (_, record) => (
        <Typography.Link onClick={() => {}}>{record.name}</Typography.Link>
      ),
    },
    {
      title: "简称",
      dataIndex: "short_name",
      ellipsis: true,
    },
    {
      title: "类型",
      dataIndex: "type",
      valueEnum: projectTypeMap,
    },
    {
      title: "性质",
      dataIndex: "nature",
    },
    {
      title: "地址",
      width: 200,
      renderText(_, row) {
        return row.address;
      },
      ellipsis: true,
    },
    {
      title: "是否签约",
      dataIndex: "is_sign",
      valueEnum: watherMap,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "statuses",
      valueEnum: StaffStatus,
    },
    {
      dataIndex: "id",
      title: "操作",
      fixed: "right",
      width: 160,
      render(_, row) {
        return (
          <Space>
            <Button type="text">编辑</Button>
            <Button type="text" danger>
              删除
            </Button>
          </Space>
        );
      },
    },
  ]);

  useEffect(() => {
    table.reload();
  }, []);

  return (
    <PageWrapper>
      <Affix offsetTop={theme.padding}>
        <Card bordered>
          <QueryFilter
            defaultCollapsed
            split
            searchGutter={8}
            style={{ padding: 0, rowGap: 0 }}
            loading={table.loading}
            onReset={table.onReset}
            onFinish={table.onFinish}
          >
            <ProFormText
              label="关键词"
              name="keyword"
              placeholder="按客户搜索"
            />
          </QueryFilter>
        </Card>
      </Affix>

      <ProTable
        rowKey="id"
        style={{ marginTop: theme.margin }}
        search={false}
        loading={table.loading}
        options={table.options}
        dataSource={table.dataSource}
        pagination={table.pagination}
        onChange={table.onChange}
        columns={column}
        scroll={{ x: table.measureColumnWidth(column) }}
      />

      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建客户"
          icon={<Icon width={18} height={18} icon={AddSvg} />}
          onClick={() => {
            create.current?.create().then((result) => {
              contextedMessage.message?.success("新增成功");
              table.reload();
              const window = openWindow.openCurrentAppWindow(
                `/client/client/edit?id=${result.id}`
              );
              function listener(event: MessageEvent<"success">) {
                if (event.data === "success") {
                  table.reload();
                  contextedMessage.message?.success("编辑成功");
                }
              }
              if (window) {
                window.addEventListener("message", listener);
              }
            });
          }}
        />
      </FloatButton.Group>
      <Create.default ref={create} />
    </PageWrapper>
  );
}

export default styled(Client)``;
