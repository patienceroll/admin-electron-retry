import fetch from "src/util/fetch";


export const InventoryDetailStatus = new Map<
  InventoryDetailtatus,
  EnumValue<InventoryDetailtatus>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);


/**
 * 库存-列表
 */
export function getInventoryList(
  params: ListParam & {
    status?: BillStatus;
  }
) {
  return fetch.GET<List<Inventory>>(fetch.base(`/api/inventory/list`), params);
}

/** 库存汇总 */
export function inventorySummary(params: {
  /**
   * 类型;,1:按仓库,2:按项目,3:按合同,4:按订单
   */
  type: 1 | 2 | 3 | 4;
}) {
  return fetch.GET<Record<string, Record<string, InventorySummary[]>>>(
    fetch.base(`/api/inventory/material-show`),
    params
  );
}

/** 库存展示 */
export function inventoryDetailShow(params: {
  /**
   * 类型;,1:按仓库,2:按项目,3:按合同,4:按订单
   */
  type: 1 | 2 | 3 | 4;
}) {
  return fetch.GET<Record<string, Record<string, InventoryDetail[]>>>(
    fetch.base(`/api/inventory/inventory-show`),
    params
  );
}

/** 库存明细 */
export function inventoryDetailSummary(params: {
  material_id: string | number;
  /**
   * 按项目必传
   */
  project_id?: Project["id"];
  /**
   * 按合同必传
   */
  sales_contract_id?: SalesContract["id"];
  /**
   * 按订单必传
   */
  sales_order_id?: SalesOrder["id"];
  /**
   * 类型;,1:按仓库,2:按项目,3:按合同,4:按订单
   */
  type: 1 | 2 | 3 | 4;
  /**
   * 按仓库必传
   */
  warehouse_id?: Warehouse["id"];
}) {
  return fetch.GET<InventoryDetailSummary>(
    fetch.base(`/api/inventory/detail-show`),
    params
  );
}

/** 库存明细页-批次展示 */
export function inventoryDetailSummaryBatch(params: {
  material_sku_id: MaterialSku["id"];
  /**
   * 按项目必传
   */
  project_id?: Project["id"];
  /**
   * 按合同必传
   */
  sales_contract_id?: SalesContract["id"];
  /**
   * 按订单必传
   */
  sales_order_id?: SalesOrder["id"];
  /**
   * 按仓库
   */
  warehouse_id?: Warehouse["id"];
  /**
   * 类型;,1:按仓库,2:按项目,3:按合同,4:按订单
   */
  type: 1 | 2 | 3 | 4;
}) {
  return fetch.GET<InventoryDetailSummaryBatch[]>(
    fetch.base(`/api/inventory/batch-show`),
    params
  );
}

/** 库存-导出 */
export function inventoryExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/inventory/export`), params);
}
