import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Affix, Card } from "antd";
import { ProFormText, ProTable, QueryFilter } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";

import { getUserList, userStatus } from "src/apps/admin/api/login";

function Message() {
  const table = useSearchTable(getUserList);
  const theme = useTheme();
  const column = table.column([
    {
      title: "类型",
      dataIndex: "type",
    },
    {
      title: "用户名",
      dataIndex: "name",
    },
    {
      title: "账号",
      dataIndex: "account",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "设备id",
      dataIndex: "device_id",
    },
    {
      title: "最后登录ip",
      dataIndex: "login_ip",
    },
    {
      title: "最后登录时间",
      dataIndex: "login_time",
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: userStatus,
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
              placeholder="按名称/账号筛选"
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
