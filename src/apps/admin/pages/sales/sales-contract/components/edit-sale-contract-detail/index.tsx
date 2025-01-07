import React, { useEffect } from "react";
import ProTable from "@ant-design/pro-table";
import { useTheme } from "styled-components";
import { Button } from "antd";

import { getSalesContractDetailList } from "src/apps/admin/api/sales-contract-detail";
import useSearchTable from "src/hooks/use-search-table";
import * as ChooseMaterial from "./choose-material";

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props;
  const theme = useTheme();

  const table = useSearchTable(getSalesContractDetailList);

  const chooseMaterial = ChooseMaterial.createRef();

  const column = table.column([
    {
      title: "产品",
      key: "material",
      fixed: "left",
      renderText: (_, row) => row.material?.name,
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
      dataIndex: "standard_attributes",
      // render(_, row) {
      //   return (
      //     <AttrSnapshoot attr_snapshoot={row.material_sku?.attr_snapshoot} />
      //   );
      // },
    },
    // {
    //   title: "执行属性",
    //   key: "execution_attributes",
    //   dataIndex: "execution_attributes",
    //   width: 340,
    //   render(_, row) {
    //     return (
    //       <AttrSnapshoot
    //         attr_snapshoot={row.attr_snapshoot}
    //       />
    //     );
    //   },
    // },
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
        <ChooseMaterial.default key="choose" ref={chooseMaterial} />,
      ]}
    />
  );
}
