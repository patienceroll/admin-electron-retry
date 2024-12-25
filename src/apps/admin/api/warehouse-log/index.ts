import fetch from "src/util/fetch";

export const recordTypeMap = new Map<
  WarehouseLog["type"],
  EnumValue<WarehouseLog["type"]>
>([
  [1, { value: 1, color: "#cfc922", text: "入库" }],
  [2, { value: 2, color: "#6a8fc3", text: "出库" }],
  [3, { value: 3, color: "rgb(131 157 107)", text: "盘点" }],
]);

/**
 * 出入库记录-列表
 */
export function getWarehouseLogList(params: ListParam) {
  return fetch.GET<List<WarehouseLog>>(
    fetch.base(`/api/warehouse-log/list`),
    params,
  );
}

/** 出入库记录-导出 */
export function warehouseLogExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/warehouse-log/export`), params);
}
