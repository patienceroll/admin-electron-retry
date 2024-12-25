import fetch from "src/util/fetch";

export const inStockStatus = new Map<
  InStock["status"],
  EnumValue<InStock["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待入库" }],
  [2, { value: 2, color: "#d46b08", text: "入库中" }],
  [3, { value: 3, color: "#7cb305", text: "已入库" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 入库单-列表
 */
export function getInStockList(
  params: ListParam & {
    status?: BillStatus;
  },
) {
  return fetch.GET<List<InStock>>(fetch.base(`/api/in-stock/list`), params);
}

/**
 * 入库单-详情
 */
export function getInStock(params: Pick<InStock, "id">) {
  return fetch.GET<InStock>(fetch.base(`/api/in-stock/detail`), params);
}

/**
 * 入库单-添加
 */
export function addInStock(params: any) {
  return fetch.POST<InStockAddResponse>(fetch.base(`/api/in-stock`), params);
}

/**
 * 入库单-编辑
 */
export function editInStock(params: any) {
  return fetch.PUT(fetch.base(`/api/in-stock`), params);
}

/**
 * 入库单-删除
 */
export function deleteInStock(params: Pick<InStock, "id">) {
  return fetch.DELETE(fetch.base(`/api/in-stock`), params);
}

/**
 * 生成合同编号 */
export const getInStockCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/in-stock/code"),
  );
};

/**
 * 物资.弹窗 */
export const getInStockMaterialSku = (
  params: ListParam & {
    id?: InStock["id"];
  },
) => {
  return fetch.GET<List<InStockMaterialSku>>(
    fetch.base("/api/in-stock/material-sku"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postInStockMaterialSku = (data: {
  id: InStock["id"];
  ids: InStockMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/in-stock/material-sku"), data);
};

/** 入库单-发起审批 */
export function startApproval(params: Pick<InStock, "id">) {
  return fetch.POST(fetch.base(`/api/in-stock/start-approval`), params);
}

/** 入库单-审批 */
export function approval(params: {
  id: InStock["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/in-stock/approval`), params);
}

/** 入库单-作废 */
export function billInvalid(params: Pick<InStock, "id">) {
  return fetch.POST(fetch.base(`/api/in-stock/invalid`), params);
}

/** 入库单-中止 */
export function billSuspend(params: Pick<InStock, "id">) {
  return fetch.POST(fetch.base(`/api/in-stock/suspend`), params);
}

/** 入库单-完成入库 */
export function billEnd(params: Pick<InStock, "id">) {
  return fetch.POST(fetch.base(`/api/in-stock/end`), params);
}

/** 入库单-开始入库 */
export function billStart(params: Pick<InStock, "id">) {
  return fetch.POST(fetch.base(`/api/in-stock/start`), params);
}

/** 入库单-撤销 */
export function cancelOperate(params: Pick<InStock, "id">) {
  return fetch.POST(fetch.base(`/api/in-stock/cancel-operate`), params);
}

/** 入库单-审批记录 */
export function getApprovalRecord(params: Pick<InStock, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/in-stock/approval-record`),
    params,
  );
}

/** 入库单-导出 */
export function inStockExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/in-stock/export`), params);
}

/** 发货单-操作记录 */
export function getOperateRecord(params: Pick<InStock, "id">) {
  return fetch.GET<OperateRecord[]>(fetch.base(`/api/in-stock/log`), params);
}
