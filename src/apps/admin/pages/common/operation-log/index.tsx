import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Affix, Card, Col, Row, Typography } from "antd";
import { ProFormText, ProTable, QueryFilter } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import { getOperationLogList } from "src/apps/admin/api/operation-log";
import usePageTableHeight from "src/hooks/use-page-table-height";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";

function OperationLog() {
  const table = useSearchTable(getOperationLogList);
  const theme = useTheme();
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );
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
                name="created_user"
                label="用户"
                placeholder="搜索操作用户"
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
        scroll={{ x: table.measureColumnWidth(column), y: height }}
      />
    </PageWrapper>
  );
}

export default styled(OperationLog)``;
