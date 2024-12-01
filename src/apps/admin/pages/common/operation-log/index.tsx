import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Affix, Card, Typography } from "antd";
import { ProFormText, ProTable, QueryFilter } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import { getOperationLogList } from "src/apps/admin/api/operation-log";

function OperationLog() {
  const table = useSearchTable(getOperationLogList);
  const theme = useTheme();
  const column = table.column([
    {
      title: "用户",
      dataIndex: "created_user",

      renderText(_, row) {
        return row.created_user?.name;
      },
    },
    {
      title: "标记",
      dataIndex: "tag",
    },
    {
      title: "业务",
      dataIndex: "service_name",
    },
    {
      title: "内容",
      dataIndex: "remark",
      width: 300,
      render: (_, row) => (
        <Typography.Paragraph
          ellipsis={{
            rows: 2,
            expandable: false,
            tooltip: row.remark,
          }}
        >
          {row.remark}
        </Typography.Paragraph>
      ),
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
              name="created_user"
              label="用户"
              placeholder="搜索操作用户"
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

export default styled(OperationLog)``;
