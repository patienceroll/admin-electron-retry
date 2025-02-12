import { ProTable } from "@ant-design/pro-components";
import React, { useEffect } from "react";
import { useTheme } from "styled-components";

import { getSalesContractList } from "src/apps/admin/api/sales-contract";
import useSearchTable, {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";

export default function (props: { id: Client["id"] }) {
  const { id } = props;
  const theme = useTheme();

  const saleContact = useSearchTable(getSalesContractList);

  const column = tableColumn<NonNullable<ClientContact["detail"]>[number]>([
    {
      title: "物资",
      dataIndex: "material",
      renderText: (_, row) => row.material?.name,
      fixed: "left",
    },
    {
      title: "拓展属性",
      dataIndex: "material_sku",
      width: 200,
      renderText: (_, row) => {
        const value = row.material_sku?.attr_snapshoot || {};
        return Object.keys(value)
          .map((key) => `${key}:${value[key]}`)
          .join(" ");
      },
    },
    {
      title: "图片",
      valueType: "image",
      renderText(_, row) {
        return row.material_sku?.picture_path || row.material?.picture_path;
      },
    },
    {
      title: "规格型号",
      dataIndex: "material",
      renderText: (_, row) => row.material?.model,
    },
    {
      title: "数量",
      dataIndex: "num",
    },
    {
      title: "单价",
      dataIndex: "price",
    },
    {
      title: "金额",
      dataIndex: "amount",
    },
    {
      title: "单位",
      dataIndex: "material",
      renderText: (_, row) => row.material?.unit,
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ]);

  useEffect(() => {
    saleContact.extraParams.current.client_id = Number(id);
    saleContact.extraParams.current.is_show_detail = 1;
    saleContact.reload();
  }, [id]);

  return (
    <ProTable
      search={false}
      rowKey="id"
      style={{ marginTop: theme.margin }}
      options={saleContact.options}
      loading={saleContact.loading}
      dataSource={saleContact.dataSource}
      pagination={saleContact.pagination}
      onChange={saleContact.onChange}
      columns={saleContact.column([
        {
          title: "合同编号",
          dataIndex: "code",
        },
        {
          title: "合同名称",
          dataIndex: "name",
        },
        {
          title: "签约日期",
          dataIndex: "sign_date",
        },
      ])}
      expandable={{
        childrenColumnName: "detail",
        columnWidth: 100,
        rowExpandable(record) {
          return Boolean(record.detail && record.detail.length !== 0);
        },
        expandedRowRender(row) {
          if (!row.detail) return null;

          return (
            <ProTable
              style={{ width: "100%" }}
              rowKey="id"
              search={false}
              options={false}
              pagination={false}
              dataSource={row.detail}
              columns={column}
              scroll={{ x: tableMeasureColumnWidth(column) }}
            />
          );
        },
      }}
    />
  );
}
