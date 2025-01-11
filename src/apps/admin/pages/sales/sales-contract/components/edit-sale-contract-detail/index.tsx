import React, { useEffect } from "react";
import ProTable from "@ant-design/pro-table";
import { useTheme } from "styled-components";
import { Button } from "antd";

import {
  getSalesContractDetailList,
  salesContractDetailRenderConfig,
} from "src/apps/admin/api/sales-contract-detail";
import useSearchTable from "src/hooks/use-search-table";
import * as ChooseMaterial from "./choose-material";
import useRenderNames from "src/b-hooks/use-render-names";

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props;
  const theme = useTheme();

  const table = useSearchTable(getSalesContractDetailList);

  const chooseMaterial = ChooseMaterial.createRef();

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
        <ChooseMaterial.default
          key="choose"
          ref={chooseMaterial}
          attrCoumn={attrCoumn}
        />,
      ]}
    />
  );
}
