import React, { useEffect } from "react";
import { Table } from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { useTheme } from "styled-components";
import Decimal from "decimal.js";

import { getSalesContractDetailList } from "src/apps/admin/api/sales-contract-detail";
import useSearchTable from "src/hooks/use-search-table";
import Money from "src/util/money";
import useColumnState from "src/hooks/use-column-state";

export default function (
  props: Pick<SalesContract, "id"> & {
    attrCoumn: ProColumns<any>[];
    unitColumn: ProColumns<any>[];
  },
) {
  const { id, attrCoumn, unitColumn } = props;
  const theme = useTheme();

  const table = useSearchTable(getSalesContractDetailList);

  const column = table.column([
    {
      title: "产品",
      dataIndex: "material",
      fixed: "left",
      renderText: (_, row) => row.material?.name,
    },
    ...attrCoumn,
    {
      title: "执行标准",
      dataIndex: "standard",
    },
    ...unitColumn,
    {
      title: "金额",
      dataIndex: "amount",
      valueType: "money",
    },
    {
      title: "备注",
      dataIndex: "remark",
      renderText: (_, row) => row.remark,
    },
  ]);

  useEffect(() => {
    table.extraParams.current.sales_contract_id = id;
    table.reload();
  }, []);

  const columnState = useColumnState(
    "salesContractDetail_ContractDetail",
    column,
  );

  return (
    <ProTable
      style={{ marginTop: theme.margin }}
      rowKey="id"
      search={false}
      loading={table.loading}
      options={table.options}
      dataSource={table.dataSource}
      pagination={table.pagination}
      onChange={table.onChange}
      columns={columnState.column}
      scroll={{ x: table.measureColumnWidth(columnState.widthColumn), y: 500 }}
      columnsState={{
        value: columnState.data?.data,
        onChange: columnState.onChange,
      }}
      summary={(data) => {
        return (
          <Table.Summary.Row>
            {columnState.widthColumn.map((col, index) => (
              <Table.Summary.Cell index={index}>
                {index === 0 && "合计"}
                {col.dataIndex === "amount" &&
                  new Money(
                    data.reduce(
                      (pre, current) =>
                        new Decimal(pre).add(current.amount || 0).toNumber(),
                      0,
                    ),
                  ).toCNY()}
              </Table.Summary.Cell>
            ))}
          </Table.Summary.Row>
        );
      }}
    />
  );
}
