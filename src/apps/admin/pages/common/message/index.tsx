import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Affix, Card, Typography } from "antd";
import {
  ProFormSelect,
  ProFormText,
  ProTable,
  QueryFilter,
} from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import { getMessageList, messageStatus } from "src/apps/admin/api/message";
import { platformLibrary } from "src/apps/admin/api/platform";

function Message() {
  const table = useSearchTable(getMessageList);
  const theme = useTheme();
  const column = table.column([
    {
      title: "终端",
      dataIndex: "terminal",
      valueEnum: platformLibrary,
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "内容",
      dataIndex: "content",

      render: (_, row) => (
        <Typography.Paragraph
          ellipsis={{
            rows: 2,
            expandable: false,
            tooltip: row.content,
          }}
        >
          {row.content}
        </Typography.Paragraph>
      ),
    },
    {
      title: "发送人",
      dataIndex: "created_user",

      renderText(_, row) {
        return row.created_user?.name;
      },
    },
    {
      title: "接收人",
      dataIndex: "user",

      renderText(_, row) {
        return row.user?.name;
      },
    },
    {
      title: "状态",
      dataIndex: "status",

      valueEnum: messageStatus,
    },
    {
      title: "时间",
      dataIndex: "created_at",
    },
  ]);

  useEffect(() => {
    table.getData();
  }, []);

  return (
    <PageWrapper>
      <Affix offsetTop={theme.padding}>
        <Card bordered>
          <QueryFilter
            defaultCollapsed
            split
            style={{ padding: 0, rowGap: 0 }}
            loading={table.loading}
            onReset={table.onReset}
            onFinish={table.onFinish}
          >
            <ProFormText
              name="keyword"
              label="关键词"
              placeholder="按照标题筛选"
            />
            <ProFormSelect
              label="终端"
              name="terminal"
              placeholder="按终端筛选"
              mode="multiple"
              fieldProps={{ fieldNames: { label: "text", value: "value" } }}
              options={Array.from(platformLibrary.values())}
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
    </PageWrapper>
  );
}

export default styled(Message)``;
