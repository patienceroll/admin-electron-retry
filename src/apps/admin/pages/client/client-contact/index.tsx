import React, { useEffect } from "react";
import PageWrapper from "src/framework/component/page-wrapper";
import styled, { useTheme } from "styled-components";
import {
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Affix, Button, Card, Col, FloatButton, Row, Space } from "antd";

import useSearchTable from "src/hooks/use-search-table";
import {
  clientContactExport,
  ClientContactStatus,
  deleteClientContact,
  getClientContactList,
} from "src/apps/admin/api/client-concat";
import useOption from "src/hooks/use-option";
import { getClientOption } from "src/apps/admin/api/client";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";
import useColumnState from "src/hooks/use-column-state";
import * as Modify from "./components/modify";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import ExportSvg from "src/assets/svg/导出.svg";

function ClientContact() {
  const table = useSearchTable(getClientContactList);
  const theme = useTheme();
  const modify = Modify.createRef();

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
    {
      title: "操作",
      dataIndex: "action",
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={() => {
                modify.current?.edit(row).then(() => {
                  table.reload();
                  contextedMessage.message?.success("成功编辑");
                });
              }}
            >
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
                    return deleteClientContact({ id: row.id }).then(() => {
                      contextedMessage.message?.success("成功删除");
                      table.reload();
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

      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建联系人"
          icon={<Icon icon={AddSvg} />}
          onClick={() => {
            modify.current?.create().then(() => {
              contextedMessage.message?.success("新增成功");
              table.reload();
            });
          }}
        />

        {window.preload.getLocalUserHasPermission(
          "/client/client-contact",
          "export"
        ) && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            tooltip="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              clientContactExport({
                ...table.params.current,
                ...table.extraParams.current,
              }).then((res) => {
                window.preload.previewFile(res.data.file_path);
              });
            }}
          />
        )}
      </FloatButton.Group>
      <Modify.default ref={modify} />
    </PageWrapper>
  );
}
export default styled(ClientContact)``;
