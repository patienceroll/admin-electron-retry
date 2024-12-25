import fetch from "src/util/fetch";

export const outStockStatus = new Map<
  OutStock["status"],
  EnumValue<OutStock["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待出库" }],
  [2, { value: 2, color: "#d46b08", text: "出库中" }],
  [3, { value: 3, color: "#7cb305", text: "已出库" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 出库单-列表
 */
export function getOutStockList(
  params: ListParam & {
    status?: BillStatus;
  },
) {
  return fetch.GET<List<OutStock>>(fetch.base(`/api/out-stock/list`), params);
}

/**
 * 出库单-详情
 */
export function getOutStock(params: Pick<OutStock, "id">) {
  return fetch.GET<OutStock>(fetch.base(`/api/out-stock/detail`), params);
}

/**
 * 出库单-添加
 */
export function addOutStock(params: any) {
  return fetch.POST<OutStockAddResponse>(fetch.base(`/api/out-stock`), params);
}

/**
 * 出库单-编辑
 */
export function editOutStock(params: any) {
  return fetch.PUT(fetch.base(`/api/out-stock`), params);
}

/**
 * 出库单-删除
 */
export function deleteOutStock(params: Pick<OutStock, "id">) {
  return fetch.DELETE(fetch.base(`/api/out-stock`), params);
}

/**
 * 生成合同编号 */
export const getOutStockCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/out-stock/code"),
  );
};

/**
 * 物资.弹窗 */
export const getOutStockMaterialSku = (
  params: ListParam & {
    id?: OutStock["id"];
  },
) => {
  return fetch.GET<List<OutStockMaterialSku>>(
    fetch.base("/api/out-stock/inventory-material"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postOutStockMaterialSku = (data: {
  id: OutStock["id"];
  ids: OutStockMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/out-stock/inventory-material"), data);
};

/** 出库单-发起审批 */
export function startApproval(params: Pick<OutStock, "id">) {
  return fetch.POST(fetch.base(`/api/out-stock/start-approval`), params);
}

/** 出库单-审批 */
export function approval(params: {
  id: OutStock["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/out-stock/approval`), params);
}

/** 出库单-作废 */
export function billInvalid(params: Pick<OutStock, "id">) {
  return fetch.POST(fetch.base(`/api/out-stock/invalid`), params);
}

/** 出库单-中止 */
export function billSuspend(params: Pick<OutStock, "id">) {
  return fetch.POST(fetch.base(`/api/out-stock/suspend`), params);
}

/** 出库单-完成入库 */
export function billEnd(params: Pick<OutStock, "id">) {
  return fetch.POST(fetch.base(`/api/out-stock/end`), params);
}

/** 出库单-开始入库 */
export function billStart(params: Pick<OutStock, "id">) {
  return fetch.POST(fetch.base(`/api/out-stock/start`), params);
}

/** 出库单-撤销 */
export function cancelOperate(params: Pick<OutStock, "id">) {
  return fetch.POST(fetch.base(`/api/out-stock/cancel-operate`), params);
}

/** 出库单-审批记录 */
export function getApprovalRecord(params: Pick<OutStock, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/out-stock/approval-record`),
    params,
  );
}

/** 出库单-导出 */
export function outStockExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/out-stock/export`), params);
}

/** 发货单-操作记录 */
export function getOperateRecord(params: Pick<OutStock, "id">) {
  return fetch.GET<OperateRecord[]>(fetch.base(`/api/out-stock/log`), params);
}
