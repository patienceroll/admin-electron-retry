import React, { useEffect, useState } from "react";
import {
  Affix,
  Button,
  Card,
  Col,
  FloatButton,
  Row,
  Space,
  Typography,
} from "antd";
import styled, { useTheme } from "styled-components";
import {
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  clientExport,
  deleteClient,
  getClientList,
  StaffStatus,
} from "src/apps/admin/api/client";
import { projectTypeMap } from "src/apps/admin/api/project";
import { watherMap } from "src/apps/admin/api/general";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import FollowSvg from "src/assets/svg/线索跟进.svg";
import ExportSvg from "src/assets/svg/导出.svg";
import * as Create from "./components/create";
import contextedMessage from "src/framework/component/contexted-message";
import openWindow from "src/util/open-window";
import contextedModal from "src/framework/component/contexted-modal";
import * as Follow from "./components/batch-follow";
import useColumnState from "src/hooks/use-colum-state";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";

function Client() {
  const table = useSearchTable(getClientList);
  const theme = useTheme();

  const create = Create.createRef();
  const follow = Follow.createRef();

  const [select, setSelect] = useState<ClientListItem[]>([]);

  const column = table.column([
    {
      title: "客户",
      dataIndex: "name",
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            openWindow.openCurrentAppWindow(
              `/client/client/detail?id=${record.id}`,
              "客户详情 - " + record.name_show
            );
          }}
        >
          {record.name}
        </Typography.Link>
      ),
      width: 260,
      ellipsis: true,
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
      ellipsis: true,
    },
    {
      title: "性质",
      dataIndex: "nature",
      ellipsis: true,
    },
    {
      title: "等级",
      dataIndex: "grade",
      ellipsis: true,
    },
    {
      title: "规模",
      dataIndex: "scale",
      ellipsis: true,
    },
    {
      title: "省",
      dataIndex: "province",
      ellipsis: true,
    },
    {
      title: "市",
      dataIndex: "city",
      ellipsis: true,
    },
    {
      title: "区",
      dataIndex: "county",
      ellipsis: true,
    },
    {
      title: "成立日期",
      dataIndex: "establishment_date",
      ellipsis: true,
    },
    {
      title: "信息完善度",
      dataIndex: "perfect_ratio",
      ellipsis: true,
      valueType: "progress",
    },
    {
      title: "是否签约",
      dataIndex: "is_sign",
      valueEnum: watherMap,
      ellipsis: true,
    },
    {
      title: "负责人",
      dataIndex: "staff",
      renderText: (_, row) => row.staff?.name,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: StaffStatus,
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      ellipsis: true,
    },
    {
      dataIndex: "id",
      title: "操作",
      fixed: "right",
      width: 160,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={function () {
                const window = openWindow.openCurrentAppWindow(
                  `/client/client/edit?id=${row.id}`,
                  `编辑 - ${row.name_show}`
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
                    return deleteClient({ id: row.id }).then(() => {
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

  const columnState = useColumnState("clientlist", column);

  useEffect(() => {
    table.reload();
  }, []);

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
                  placeholder="按客户搜索"
                />
              </Col>
              <Col flex="300px">
                <ProFormSelect
                  label="客户类型"
                  name="type"
                  options={Array.from(projectTypeMap.values())}
                  fieldProps={{ fieldNames: { label: "text", value: "value" } }}
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
        rowSelection={{
          selectedRowKeys: select.map((i) => i.id),
          preserveSelectedRowKeys: true,
          type: "checkbox",
          fixed: "left",
          onChange(_, rows) {
            setSelect(rows);
          },
        }}
      />

      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建客户"
          icon={<Icon icon={AddSvg} />}
          onClick={() => {
            create.current?.create().then((result) => {
              contextedMessage.message?.success("新增成功");
              table.reload();
              const window = openWindow.openCurrentAppWindow(
                `/client/client/edit?id=${result.id}`,
                "编辑新创建的客户"
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
        {select.length !== 0 && (
          <FloatButton
            icon={<Icon icon={FollowSvg} />}
            tooltip="批量跟进"
            onClick={function () {
              follow.current?.follow(select).then(() => {
                contextedMessage.message?.success("成功提交");
              });
            }}
          />
        )}
        {window.preload.getLocalUserHasPermission(
          "/client/client",
          "export"
        ) && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            tooltip="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              clientExport({
                ...table.params.current,
                ...table.extraParams.current,
              }).then((res) => {
                window.preload.previewFile(res.data.file_path);
              });
            }}
          />
        )}
      </FloatButton.Group>
      <Create.default ref={create} />
      <Follow.default ref={follow} />
    </PageWrapper>
  );
}

export default styled(Client)``;
