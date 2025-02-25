import fetch from "src/util/fetch";





export const WarehouseStatus = new Map<
  WarehouseListItemStatus,
  EnumValue<WarehouseListItemStatus>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 仓库-列表
 */
export function getWarehouseList(params: ListParam) {
  return fetch.GET<List<Warehouse>>(fetch.base(`/api/warehouse/list`), params);
}
/**
 * 仓库-选项
 */
export function getWarehouseOption(params: {}) {
  return fetch.GET<Warehouse[]>(fetch.base(`/api/warehouse/list`), params);
}

/**
 * 仓库-详情
 */
export function getWarehouse(params: Pick<Warehouse, "id">) {
  return fetch.GET<Warehouse>(fetch.base(`/api/warehouse/detail`), params);
}

/**
 * 仓库-添加
 */
export function addWarehouse(params: any) {
  return fetch.POST(fetch.base(`/api/warehouse`), params);
}

/**
 * 仓库-编辑
 */
export function editWarehouse(params: any) {
  return fetch.PUT(fetch.base(`/api/warehouse`), params);
}

/**
 * 仓库-删除
 */
export function deleteWarehouse(params: Pick<Warehouse, "id">) {
  return fetch.DELETE(fetch.base(`/api/warehouse`), params);
}
