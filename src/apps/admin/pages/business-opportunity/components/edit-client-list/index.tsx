import { ProTable } from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import useSearchTable, { tableColumn } from "src/hooks/use-search-table";
import { clientTypeMap, getClientList } from "src/apps/admin/api/client";
import { Button, Space } from "antd/es";
import contextedModal from "src/framework/component/contexted-modal";
import { deleteClientContact } from "src/apps/admin/api/client-concat";
import contextedMessage from "src/framework/component/contexted-message";
import { deleteProjectClient } from "src/apps/admin/api/project";
import * as ModifyClient from "./modify-client";
import * as ModifyConcat from "./modify-contact";

function EditClientList(
  props: StyledWrapComponents<{ id: BusinessOpportunity["id"] }>
) {
  const { className, id } = props;
  const theme = useTheme();

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const table = useSearchTable(getClientList);

  const modifyClient = ModifyClient.createRef();
  const modifyConcat = ModifyConcat.createRef();

  const column = table.column([
    {
      title: "单位",
      dataIndex: "name",
    },
    {
      title: "类型",
      dataIndex: "type",
      valueEnum: clientTypeMap,
    },
    {
      title: "性质",
      dataIndex: "nature",
    },
    {
      title: "地址",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "id",
      fixed: "right",
      width: 250,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={() => {
                modifyClient.current?.edit(row).then(() => {
                  contextedMessage.message?.success("成功编辑");
                  table.reload();
                });
              }}
            >
              编辑
            </Button>
            <Button
              type="text"
              onClick={() => {
                modifyConcat.current?.create(row.id).then(() => {
                  contextedMessage.message?.success("成功新增");
                  table.reload();
                });
              }}
            >
              添加联系人
            </Button>
            <Button
              type="text"
              danger
              onClick={function () {
                contextedModal.modal?.confirm({
                  title: "删除",
                  content: `确定删除${row.name}?`,
                  onOk() {
                    return deleteProjectClient({ id: row.id }).then(() => {
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

  const expandColumn = tableColumn<NonNullable<Client["contact"]>[number]>([
    { title: "联系人", dataIndex: "name" },
    {
      title: "职位",
      dataIndex: "job_title",
    },
    {
      title: "手机",
      dataIndex: "phone",
    },
    {
      title: "微信",
      dataIndex: "wechat",
    },
    {
      title: "身份证",
      dataIndex: "ID_card",
    },
    {
      title: "编辑",
      dataIndex: "id",
      width: 200,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={() => {
                modifyConcat.current?.edit(row).then(() => {
                  contextedMessage.message?.success("成功编辑");
                  table.reload();
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
                  async onOk() {
                    await deleteClientContact({
                      id: row.id,
                    });
                    contextedMessage.message?.success("成功删除");
                    table.reload();
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
    table.extraParams.current.business_opportunity_id = id;
    table.reload();
  }, []);

  return (
    <div className={className}>
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
          x: Math.max(
            table.measureColumnWidth(expandColumn),
            table.measureColumnWidth(column)
          ),
          y: "60vh"
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              modifyClient.current?.create().then(() => {
                contextedMessage.message?.success("成功新增");
                table.reload();
              });
            }}
          >
            新增单位
          </Button>,
        ]}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange(expandedKeys) {
            setExpandedKeys([...expandedKeys]);
          },
          rowExpandable(row) {
            return !!row.contact;
          },
          expandedRowRender(row) {
            if (!row.contact) return null;
            return (
              <ProTable
                search={false}
                pagination={false}
                options={false}
                dataSource={row.contact}
                columns={expandColumn}
              />
            );
          },
        }}
      />
      <ModifyClient.default id={id} ref={modifyClient} />
      <ModifyConcat.default ref={modifyConcat} />
    </div>
  );
}

export default styled(EditClientList)``;
