import React from "react";
import styled, { useTheme } from "styled-components";
import { ProFormText, ProTable } from "@ant-design/pro-components";
import { Card, Col, Row } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import usePageTableHeight from "src/hooks/use-page-table-height";
import { getDriverList } from "src/apps/admin/api/logistics-driver";
import useColumnState from "src/hooks/use-column-state";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";

function Driver() {
  const table = useSearchTable(getDriverList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 4 : 14)
  );

  const column = table.column([]);
  const columnState = useColumnState("logistics-driver-list", column);

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
                label="姓名"
                name="keyword"
                placeholder="按姓名搜索"
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
        columns={columnState.column}
        scroll={{
          x: table.measureColumnWidth(columnState.widthColumn),
          y: height,
        }}
        columnsState={{
          value: columnState.data?.data,
          onChange: columnState.onChange,
        }}
        components={{
          header: {
            cell: columnState.tableHeaderCellRender,
          },
        }}
      />
    </PageWrapper>
  );
}

export default styled(Driver)``;
