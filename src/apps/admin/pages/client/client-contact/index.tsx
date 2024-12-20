import React, { useEffect } from "react";
import PageWrapper from "src/framework/component/page-wrapper";
import styled, { useTheme } from "styled-components";
import {
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Affix, Card, Col, Row } from "antd";

import useSearchTable from "src/hooks/use-search-table";
import {
  ClientContactStatus,
  getClientContactList,
} from "src/apps/admin/api/client-concat";
import useOption from "src/hooks/use-option";
import { getClientOption } from "src/apps/admin/api/client";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";
import useColumnState from "src/hooks/use-colum-state";

function ClientContact() {
  const table = useSearchTable(getClientContactList);
  const theme = useTheme();

  const [client] = useOption(getClientOption);

  useEffect(() => {
    table.reload();
    client.loadOption();
  }, []);

  const column = table.column([
    {
      title: "客户",
      dataIndex: "client",

      renderText(_, row) {
        return row.client?.name_show;
      },
      key: "client_ids",

      ellipsis: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "职务",
      dataIndex: "job_title",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "微信",
      dataIndex: "wechat",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "statuses",
      valueEnum: ClientContactStatus,
    },
  ]);

  const columnState = useColumnState("clientContactList", column);

  return (
    <PageWrapper>
      <Affix offsetTop={theme.padding}>
        <Card bordered>
          <Search>
            <Row gutter={[theme.padding, theme.padding]}>
              <Col flex="300px">
                <ProFormText
                  label="关键词"
                  name="keyword"
                  placeholder="按姓名搜索"
                />
              </Col>
              <Col flex="300px">
                <ProFormSelect<typeof client.list>
                  label="客户"
                  name="client_ids"
                  options={client.list}
                  fieldProps={{
                    fieldNames: { label: "name_show", value: "id" },
                    showSearch: true,
                    filterOption: true,
                    optionFilterProp: "name_show",
                    mode: "multiple",
                  }}
                />
              </Col>
              <Col flex="300px">
                <SearchAction
                  loading={table.loading}
                  onReset={table.onReset}
                  onFinish={table.onFinish}
                />
              </Col>
            </Row>
          </Search>
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
        columns={columnState.column}
        scroll={{ x: table.measureColumnWidth(column) }}
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
export default styled(ClientContact)``;
