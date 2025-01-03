import ProTable from "@ant-design/pro-table";
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

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props;
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
    {
      title: "外径",
      key: "o_diameter",
      renderText: (_, row) => row.material_sku?.o_diameter,
    },
    {
      title: "壁厚",
      key: "wall_thickness",
      renderText: (_, row) => row.material_sku?.wall_thickness,
    },
    {
      title: "内涂层厚度",
      key: "i_coat_thickness",
      renderText: (_, row) => row.material_sku?.i_coat_thickness,
    },
    {
      title: "外涂层厚度",
      key: "o_coat_thickness",
      renderText: (_, row) => row.material_sku?.o_coat_thickness,
    },
    {
      title: "长度",
      key: "length",
      renderText: (_, row) => row.material_sku?.length,
    },
    {
      title: "连接方式",
      key: "connection_type",
      renderText: (_, row) => row.material_sku?.connection_type,
    },
    {
      title: "钢卷类型",
      key: "steel_type",
      renderText: (_, row) => row.material_sku?.steel_type,
    },
    {
      title: "材质",
      key: "texture",
      renderText: (_, row) => row.material_sku?.texture,
    },
    {
      title: "内涂层颜色",
      key: "i_coat_color",
      renderText: (_, row) => row.material_sku?.i_coat_color,
    },
    {
      title: "外涂层颜色",
      key: "o_coat_color",
      renderText: (_, row) => row.material_sku?.o_coat_color,
    },
    {
      title: "拓展属性",
      dataIndex: "material_sku",
      renderText(_, row) {
        return row.material_sku?.name;
      },
      //   render(_, row) {
      //     return (
      //       <AttrSnapshoot attr_snapshoot={row.material_sku?.attr_snapshoot} />
      //     );
      //   },
    },
    {
      title: "发货明细",
      dataIndex: "id",
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
    },
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
