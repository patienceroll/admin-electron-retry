import fetch from "src/util/fetch";

export const stockCheckStatus = new Map<
  StockCheck["status"],
  EnumValue<StockCheck["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [2, { value: 2, color: "#d46b08", text: "盘点中" }],
  [3, { value: 3, color: "#7cb305", text: "已盘点" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

export const stockCheckType = new Map<
  StockCheck["type"],
  EnumValue<StockCheck["type"]>
>([
  [1, { value: 1, color: "#6a8fc3", text: "仓库" }],
  [2, { value: 2, color: "gold", text: "项目" }],
  [3, { value: 3, color: "green", text: "销售合同" }],
  [4, { value: 4, color: "#6a8fc3", text: "销售订单" }],
]);

/**
 * 盘点单-列表
 */
export function getStockCheckList(
  params: ListParam & {
    status?: BillStatus;
  },
) {
  return fetch.GET<List<StockCheck>>(
    fetch.base(`/api/stock-check/list`),
    params,
  );
}

/**
 * 盘点单-详情
 */
export function getStockCheck(params: Pick<StockCheck, "id">) {
  return fetch.GET<StockCheck>(fetch.base(`/api/stock-check/detail`), params);
}

/**
 * 盘点单-添加
 */
export function addStockCheck(params: any) {
  return fetch.POST<StockCheckAddResponse>(
    fetch.base(`/api/stock-check`),
    params,
  );
}

/**
 * 盘点单-编辑
 */
export function editStockCheck(params: any) {
  return fetch.PUT(fetch.base(`/api/stock-check`), params);
}

/**
 * 盘点单-删除
 */
export function deleteStockCheck(params: Pick<StockCheck, "id">) {
  return fetch.DELETE(fetch.base(`/api/stock-check`), params);
}

/**
 * 生成合同编号 */
export const getStockCheckCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/stock-check/code"),
  );
};

/** 盘点单-发起审批 */
export function startApproval(params: Pick<StockCheck, "id">) {
  return fetch.POST(fetch.base(`/api/stock-check/start-approval`), params);
}

/** 盘点单-审批 */
export function approval(params: {
  id: StockCheck["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/stock-check/approval`), params);
}

/** 盘点单-作废 */
export function billInvalid(params: Pick<StockCheck, "id">) {
  return fetch.POST(fetch.base(`/api/stock-check/invalid`), params);
}

/** 盘点单-完成盘点 */
export function billEnd(params: Pick<StockCheck, "id">) {
  return fetch.POST(fetch.base(`/api/stock-check/end`), params);
}

/** 盘点单-撤销 */
export function cancelOperate(params: Pick<StockCheck, "id">) {
  return fetch.POST(fetch.base(`/api/stock-check/cancel-operate`), params);
}

/** 盘点单-开始盘点 */
export function billStart(params: Pick<StockCheck, "id">) {
  return fetch.POST(fetch.base(`/api/stock-check/start`), params);
}

/** 盘点单-审批记录 */
export function getApprovalRecord(params: Pick<StockCheck, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/stock-check/approval-record`),
    params,
  );
}

/** 盘点单-库存展示 */
export function inventoryMaterialList(params: Pick<StockCheck, "id">) {
  return fetch.GET<Record<string, InventoryMaterial[]>>(
    fetch.base(`/api/stock-check/inventory-material`),
    params,
  );
}

/** 盘点单 删除条码 */
export function stockCheckDeleteBarcode(params: {
  id: StockCheck["id"];
  relation_id: BlockBarcodes["relation_id"];
}) {
  return fetch.DELETE(fetch.base(`/api/stock-check-detail/barcode`), params);
}

/** 收货单-操作记录 */
export function getOperateRecord(params: Pick<StockCheck, "id">) {
  return fetch.GET<OperateRecord[]>(fetch.base(`/api/stock-check/log`), params);
}
