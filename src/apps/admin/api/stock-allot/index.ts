import fetch from "src/util/fetch";

export const stockAllotType = new Map<
  StockAllot["type"],
  EnumValue<StockAllot["type"]>
>([
  [0, { value: 0, color: "rgb(156,156,148)", text: "未知" }],
  [1, { value: 1, color: "#6a8fc3", text: "仓库 -> 仓库" }],
  [2, { value: 2, color: "#6a8fc3", text: "项目 -> 项目" }],
  [4, { value: 4, color: "#6a8fc3", text: "销售订单 -> 销售订单" }],
  [5, { value: 5, color: "#6a8fc3", text: "仓库 -> 项目" }],
  [6, { value: 6, color: "#6a8fc3", text: "项目 -> 仓库" }],
  [7, { value: 7, color: "#6a8fc3", text: "仓库 -> 销售订单" }],
  [8, { value: 8, color: "#6a8fc3", text: "销售订单 -> 仓库" }],
]);

export const stockAllotStatus = new Map<
  StockAllot["status"],
  EnumValue<StockAllot["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [2, { value: 2, color: "#d46b08", text: "调拨中" }],
  [3, { value: 3, color: "#7cb305", text: "已调拨" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 调拨单-列表
 */
export function getStockAllotList(params: ListParam & {
  status?: StockAllot["status"];
}) {
  return fetch.GET<List<StockAllot>>(
    fetch.base(`/api/stock-allot/list`),
    params,
  );
}

/**
 * 调拨单-详情
 */
export function getStockAllot(params: Pick<StockAllot, "id">) {
  return fetch.GET<StockAllot>(fetch.base(`/api/stock-allot/detail`), params);
}

/**
 * 调拨单-添加
 */
export function addStockAllot(params: {
  in_id: number;
  out_id: number;
  out_show: string;
  in_show: string;
  type: 1 | 2 | 4;
}) {
  return fetch.POST<StockAllotAddRes>(fetch.base(`/api/stock-allot`), params);
}

/**
 * 调拨单-编辑
 */
export function editStockAllot(params: any) {
  return fetch.PUT(fetch.base(`/api/stock-allot`), params);
}

/**
 * 调拨单-删除
 */
export function deleteStockAllot(params: Pick<StockAllot, "id">) {
  return fetch.DELETE(fetch.base(`/api/stock-allot`), params);
}

/** 调拨单-审批 */
export function approval(params: {
  id: StockAllot["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/stock-allot/approval`), params);
}

/** 调拨单-发起审批 */
export function startApproval(params: Pick<StockAllot, "id">) {
  return fetch.POST(fetch.base(`/api/stock-allot/start-approval`), params);
}

/** 调拨单-审批记录 */
export function getApprovalRecord(params: Pick<StockAllot, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/stock-allot/approval-record`),
    params,
  );
}

/** 调拨单-作废 */
export function billInvalid(params: Pick<StockAllot, "id">) {
  return fetch.POST(fetch.base(`/api/stock-allot/invalid`), params);
}

/** 调拨单-撤销 */
export function cancelOperate(params: Pick<StockAllot, "id">) {
  return fetch.POST(fetch.base(`/api/stock-allot/cancel-operate`), params);
}

/** 调拨单-开始调拨*/
export function billStart(params: Pick<StockAllot, "id">) {
  return fetch.POST(fetch.base(`/api/stock-allot/start`), params);
}

/** 调拨单-完成调拨 */
export function billEnd(params: Pick<StockAllot, "id">) {
  return fetch.POST(fetch.base(`/api/stock-allot/end`), params);
}

/** 收货单-操作记录 */
export function getOperateRecord(params: Pick<StockAllot, "id">) {
  return fetch.GET<OperateRecord[]>(fetch.base(`/api/stock-allot/log`), params);
}
