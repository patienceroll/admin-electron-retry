import React, { useEffect } from "react";
import ProTable from "@ant-design/pro-table";
import { useTheme } from "styled-components";
import { Button, Space, Table } from "antd";
import Decimal from "decimal.js";

import {
  deleteSalesContractDetail,
  getSalesContractDetailList,
  salesContractDetailRenderConfig,
} from "src/apps/admin/api/sales-contract-detail";
import useSearchTable from "src/hooks/use-search-table";
import * as ChooseMaterial from "./choose-material";
import useRenderNames from "src/b-hooks/use-render-names";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";
import * as SetUnit from "./set-unit";
import Money from "src/util/money";
import useColumnState from "src/hooks/use-column-state";

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props;
  const theme = useTheme();

  const table = useSearchTable(getSalesContractDetailList);

  const chooseMaterial = ChooseMaterial.createRef();
  const setUnit = SetUnit.createRef();

  const [{ attrColumn, unitColumn }] = useRenderNames(
    salesContractDetailRenderConfig,
    {
      sales_contract_id: id,
    },
  );

  const column = table.column([
    {
      title: "产品",
      dataIndex: "material",
      fixed: "left",
      renderText: (_, row) => row.material?.name,
    },
    ...attrColumn,
    {
      title: "执行标准",
      dataIndex: "standard",
    },
    ...unitColumn,
    {
      title: "数量",
      dataIndex: "num",
    },
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
    {
      title: "操作",
      dataIndex: "action",
      fixed: "right",
      width: 150,
      render: (_, row) => (
        <Space>
          <Button
            type="text"
            onClick={function () {
              setUnit.current?.setUnit(row).then(() => {
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
                content: `确定删除${row.material?.name}?`,
                onOk() {
                  return deleteSalesContractDetail({ id: row.id }).then(() => {
                    contextedMessage.message?.success("删除成功");
                    table.reload();
                  });
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]);

  useEffect(() => {
    table.extraParams.current.sales_contract_id = id;
    table.reload();
  }, []);

  const columnState = useColumnState(
    "salesContractEdit_ContractDetail",
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
      toolBarRender={() => [
        <Button
          key="add"
          type="primary"
          onClick={() => {
            chooseMaterial.current?.choose().then(() => {
              table.reload();
            });
          }}
        >
          添加产品
        </Button>,
        <ChooseMaterial.default key="choose" ref={chooseMaterial} id={id} />,
        <SetUnit.default key="set" ref={setUnit} id={id} />,
      ]}
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
