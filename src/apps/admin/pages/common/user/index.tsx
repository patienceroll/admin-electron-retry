import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Card, Col, Row } from "antd";
import { ProFormText, ProTable } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";

import { getUserList, userStatus } from "src/apps/admin/api/login";
import usePageTableHeight from "src/hooks/use-page-table-height";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";

function Message() {
  const table = useSearchTable(getUserList);
  const theme = useTheme();
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );

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
      <Card
        bordered
        ref={(div) => {
          if (div) addAElement(div);
        }}
      >
        <Search>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="280px">
              <ProFormText
                name="keyword"
                label="关键词"
                placeholder="按名称/账号筛选"
              />
            </Col>
            <Col flex="80px">
              <SearchAction
                loading={table.loading}
                onReset={table.onReset}
                onFinish={table.onFinish}
              />
            </Col>
          </Row>
        </Search>
      </Card>
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
        scroll={{
          x: table.measureColumnWidth(column),
          y: height,
        }}
      />
    </PageWrapper>
  );
}

export default styled(Message)``;
