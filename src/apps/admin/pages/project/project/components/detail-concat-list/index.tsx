import ProTable from "@ant-design/pro-table";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import useSearchTable, { tableColumn } from "src/hooks/use-search-table";

import { clientTypeMap, getClientList } from "src/apps/admin/api/client";

const EditConcatList = function (
  props: StyledWrapComponents<{ id: Project["id"] }>
) {
  const { className, id } = props;
  const theme = useTheme();

  const table = useSearchTable(getClientList);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

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
  ]);

  useEffect(() => {
    table.extraParams.current.project_id = id;
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
          x: table.measureColumnWidth(column) + theme.padding,
          y: "60vh",
        }}
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
                scroll={{ x: table.measureColumnWidth(expandColumn) }}
              />
            );
          },
        }}
      />
    </div>
  );
};

export default styled(EditConcatList)``;
