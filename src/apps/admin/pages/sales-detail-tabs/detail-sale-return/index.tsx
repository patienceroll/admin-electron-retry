import ProTable, { ProColumns } from "@ant-design/pro-table";
import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components";

import useSearchTable, {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";

import {
  getSalesReturnList,
  salesReturnStatus,
} from "src/apps/admin/api/sales-return";

export default function (
  props: Pick<SalesContract, "id"> & {
    attrCoumn: ProColumns<any>[];
    unitColumn: ProColumns<any>[];
  }
) {
  const { id, attrCoumn, unitColumn } = props;
  const theme = useTheme();
  const table = useSearchTable(getSalesReturnList);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const column = table.column([
    {
      title: "退货编号",
      dataIndex: "code",
      copyable: true,
    },
    {
      title: "退货日期",
      dataIndex: "bill_date",
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: salesReturnStatus,
    },
  ]);

  const detailColumn = tableColumn<NonNullable<SalesReturn["detail"]>[number]>([
    {
      title: "产品",
      fixed: "left",
      dataIndex: "material",
      renderText: (_, row) => row.material?.name,
      ellipsis: true,
    },
    ...attrCoumn,
    ...unitColumn,
    {
      title: "金额",
      dataIndex: "amount",
      valueType: "money",
    },
    {
      title: "备注",
      dataIndex: "remark",
      width: 120,
    },
  ]);

  useEffect(() => {
    table.extraParams.current.sales_contract_id = id;
    table.extraParams.current.is_show_detail = 1;
    table.reload();
  }, [id]);

  return (
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
          return !!row.detail;
        },
        expandedRowRender(row) {
          if (!row.detail) return null;
          return (
            <ProTable
              search={false}
              pagination={false}
              options={false}
              dataSource={row.detail}
              columns={detailColumn}
              scroll={{ x: tableMeasureColumnWidth(detailColumn) }}
            />
          );
        },
      }}
    />
  );
}
