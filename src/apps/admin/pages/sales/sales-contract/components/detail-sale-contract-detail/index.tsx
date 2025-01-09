import React, { useEffect, useState } from "react";
import ProTable from "@ant-design/pro-table";
import { useTheme } from "styled-components";

import { getSalesContractDetailList, salesContractDetailNameRender } from "src/apps/admin/api/sales-contract-detail";
import useSearchTable from "src/hooks/use-search-table";

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props; 
  const theme = useTheme();

  const table = useSearchTable(getSalesContractDetailList);

  const [renderNames,setRenderNames] = useState<RenderNames[]>([]);

  useEffect(() => {
    salesContractDetailNameRender({ sales_contract_id: id }).then((res) => {
      setRenderNames(res.data)
    })
  },[id])

  const column = table.column([
    {
      title: "产品",
      key: "material",
      fixed:'left',
      renderText: (_, row) => row.material?.name,
    },
    ...renderNames.map<(typeof column)[number]>((item) => ({
      title: item.name,
      renderText:(_,row) => row.material_sku?.[item.key] 
    })),
    {
      title: "执行标准",
      dataIndex: "standard",
    },
    // {
    //   title: "单价信息",
    //   width: 235,
    //   render: (_, row) => {
    //     return row.line_unit.map((i) => (
    //       <div
    //         style={{
    //           display: "flex",
    //           textAlign: "left",
    //           marginLeft: 20,
    //         }}
    //         key={i.id}
    //       >
    //         <Badge
    //           status={i.is_execute ? "success" : "default"}
    //           style={{ flexShrink: 0 }}
    //         />
    //         &nbsp;
    //         <span style={{ flex: 1 }}>
    //           {i.num}&nbsp;&nbsp;(&nbsp;{i.unit}&nbsp;)
    //         </span>
    //         <span style={{ flex: 1 }}>{new Money(i.price).toCNY()}</span>
    //       </div>
    //     ));
    //   },
    // },
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
