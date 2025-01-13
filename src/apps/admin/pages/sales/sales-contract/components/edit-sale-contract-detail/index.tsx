import React, { useEffect } from "react";
import ProTable from "@ant-design/pro-table";
import { useTheme } from "styled-components";
import { Button, Space, Table } from "antd";

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

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props;
  const theme = useTheme();

  const table = useSearchTable(getSalesContractDetailList);

  const chooseMaterial = ChooseMaterial.createRef();
  const setUnit = SetUnit.createRef();

  const [_, attrCoumn, unitColumn] = useRenderNames(
    salesContractDetailRenderConfig,
    {
      sales_contract_id: id,
    }
  );

  const column = table.column([
    {
      title: "产品",
      key: "material",
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
      columns={column}
      scroll={{ x: table.measureColumnWidth(column), y: 500 }}
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
      summary={(pageData) => {
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
}
