import React, { useEffect, useState } from "react";
import ProTable from "@ant-design/pro-table";
import { useTheme } from "styled-components";

import {
  getSalesContractDetailList,
  salesContractDetailRenderConfig,
} from "src/apps/admin/api/sales-contract-detail";
import useSearchTable from "src/hooks/use-search-table";

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props;
  const theme = useTheme();

  const table = useSearchTable(getSalesContractDetailList);

  const [renderNames, setRenderNames] = useState<RenderConfig>({
    attr_fields: [],
    unit_fields: [],
  });

  useEffect(() => {
    salesContractDetailRenderConfig({ sales_contract_id: id }).then((res) => {
      setRenderNames(res.data);
    });
  }, [id]);


  const column = table.column([
    {
      title: "产品",
      key: "material",
      fixed: "left",
      renderText: (_, row) => row.material?.name,
    },
    ...renderNames.unit_fields.map<(typeof column)[number]>((item) => ({
      title: item.name,
      renderText: (_, row) => row.unit_arr?.[item.key],
    })),
    ...renderNames.attr_fields.map<(typeof column)[number]>((item) => ({
      title: item.name,
      renderText: (_, row) => row.material_sku?.[item.key],
    })),
    {
      title: "执行标准",
      dataIndex: "standard",
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
    />
  );
}
