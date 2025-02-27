import { ProTable } from "@ant-design/pro-components";
import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";

import {
  inventoryDetailShow,
  InventoryDetailStatus,
} from "src/apps/admin/api/inventory";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import useWather from "src/hooks/use-wather";
import Title from "src/framework/component/title";
import useColumnState from "src/hooks/use-column-state";

export default function (
  props: {
    /** 类型;,1:按仓库,2:按项目,3:按合同,4:按订单 */
    type: 2 | 1 | 3 | 4;
  } & Pick<CollapseProps, "accordion">
) {
  const { type, accordion } = props;
  const [data, setData] = useState<
    Record<string, Record<string, InventoryDetail[]>>
  >({});
  const [loading] = useWather();
  const theme = useTheme();

  const getDetail = useCallback(() => {
    loading.setTrue();
    return inventoryDetailShow({ type: type })
      .then((res) => {
        setData(res.data);
      })
      .finally(loading.setFalse);
  }, [loading, type]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  const column = tableColumn<InventoryDetail>([
    {
      title: "物资",
      dataIndex: "material-name",
      fixed: "left",
      renderText: (_, row) => row.material?.name,
    },
    {
      title: "项目",
      dataIndex: "project-name",
      renderText: (_, row) => row.project?.name,
    },
    {
      title: "合同",
      dataIndex: "sales_contract-name",
      renderText: (_, row) => row.sales_contract?.name,
    },
    {
      title: "销售订单",
      dataIndex: "sales_order-code",
      renderText: (_, row) => row.sales_order?.code,
    },
    {
      title: "仓库",
      dataIndex: "warehouse-name",
      renderText: (_, row) => row.warehouse?.name,
    },
    {
      title: "批次",
      dataIndex: "batch_no",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: InventoryDetailStatus,
    },
    {
      title: "拓展属性",
      dataIndex: "material_sku",
      renderText: () => "等待与后端确定",
    },
    {
      title: "库存明细",
      dataIndex: "inventory_id",
      renderText: () => "等待与后端确定",
    },
    {
      title: "物资条码",
      dataIndex: "barcodes",
      renderText: () => "等待与后端确定",
    },
  ]);

  const columnState = useColumnState(
    `inventoryDeliverOrderList_${type}`,
    column
  );

  return Object.keys(data).map((key) => (
    <>
      <Title>{key}</Title>
      <Collapse
        accordion={accordion}
        style={{ marginTop: theme.margin }}
        items={Object.keys(data[key]).map((subkey) => ({
          key: subkey,
          label: subkey,
          children: (
            <ProTable
              rowKey="id"
              search={false}
              pagination={false}
              options={{ setting: true, reload: false, density: false }}
              dataSource={data[key][subkey]}
              columns={columnState.column}
              scroll={{
                x: tableMeasureColumnWidth(columnState.widthColumn),
              }}
              columnsState={{
                value: columnState.data?.data,
                onChange: columnState.onChange,
              }}
              components={{
                header: {
                  cell: columnState.tableHeaderCellRender,
                },
              }}
            />
          ),
        }))}
      />
    </>
  ));
}
