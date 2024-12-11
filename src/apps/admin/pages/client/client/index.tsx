import React, { useEffect, useState } from "react";
import { Affix, Button, Card, FloatButton, Space, Typography } from "antd";
import styled, { useTheme } from "styled-components";
import {
  ProFormSelect,
  ProFormText,
  ProTable,
  QueryFilter,
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

function Client() {
  const table = useSearchTable(getClientList);
  const theme = useTheme();

  const create = Create.createRef();

  const [select, setSelect] = useState<ClientListItem[]>([]);

  const column = table.column([
    {
      title: "客户",
      dataIndex: "name",
      fixed: "left",
      width: 200,
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
            <ProFormSelect
              label="客户类型"
              name="type"
              options={Array.from(projectTypeMap.values())}
              fieldProps={{ fieldNames: { label: "text", value: "value" } }}
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
          icon={<Icon width={18} height={18} icon={AddSvg} />}
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
            icon={<Icon width={18} height={18} icon={FollowSvg} />}
            tooltip="批量跟进"
          />
        )}
        <FloatButton
          icon={<Icon width={18} height={18} icon={ExportSvg} />}
          tooltip="导出"
          onClick={function () {
            contextedMessage.message?.info("正在导出...");
            clientExport({ ...table.params, ...table.extraParams }).then(
              (res) => {
                window.preload.previewFile(res.data.file_path);
              }
            );
          }}
        />
      </FloatButton.Group>
      <Create.default ref={create} />
    </PageWrapper>
  );
}

export default styled(Client)``;
