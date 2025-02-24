import fetch from "src/util/fetch";

export const purchaseOrderStatus = new Map<
  PurchaseOrder["status"],
  EnumValue<PurchaseOrder["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待执行" }],
  [2, { value: 2, color: "#d46b08", text: "执行中" }],
  [3, { value: 3, color: "#7cb305", text: "已完结" }],
  [4, { value: 4, color: "#cfc922", text: "已中止" }],
  [5, { value: 5, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 采购订单-列表
 */
export function getPurchaseOrderList(
  params: ListParam & {
    status?: BillStatus;
    supplier_id?: Supplier["id"];
  }
) {
  return fetch.GET<List<PurchaseOrder>>(
    fetch.base(`/api/purchase-order/list`),
    params
  );
}
/**
 * 采购订单-选项
 */
export function getPurchaseOrderOptions(
  params: ListParam & {
    status?: BillStatus;
    supplier_id?: Supplier["id"];
    statuses?: PurchaseOrder["status"][];
  }
) {
  return fetch.GET<PurchaseOrder[]>(
    fetch.base(`/api/purchase-order/list`),
    params
  );
}

/**
 * 采购订单-详情
 */
export function getPurchaseOrder(params: Pick<PurchaseOrder, "id">) {
  return fetch.GET<PurchaseOrder>(
    fetch.base(`/api/purchase-order/detail`),
    params
  );
}

/**
 * 采购订单-添加
 */
export function addPurchaseOrder(params: any) {
  return fetch.POST<PurchaseOrderAddResponse>(
    fetch.base(`/api/purchase-order`),
    params
  );
}

/**
 * 采购订单-编辑
 */
export function editPurchaseOrder(params: any) {
  return fetch.PUT(fetch.base(`/api/purchase-order`), params);
}

/**
 * 采购订单-删除
 */
export function deletePurchaseOrder(params: Pick<PurchaseOrder, "id">) {
  return fetch.DELETE(fetch.base(`/api/purchase-order`), params);
}

/**
 * 生成合同编号 */
export const getPurchaseOrderCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/purchase-order/code")
  );
};

/**
 * 物资.弹窗 */
export const getPurchaseOrderMaterialSku = (
  params: ListParam & {
    sales_contract_id?: PurchaseOrder["sales_contract_id"];
    id?: PurchaseOrder["id"];
  }
) => {
  return fetch.GET<List<PurchaseOrderMaterialSku>>(
    fetch.base("/api/purchase-order/superior-detail"),
    params
  );
};

/**
 * 物资.弹窗-保存
 */
export const postPurchaseOrderMaterialSku = (data: {
  id: PurchaseOrder["id"];
  ids: PurchaseOrderMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/purchase-order/superior-detail"), data);
};

/** 采购订单-发起审批 */
export function startApproval(params: Pick<PurchaseOrder, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-order/start-approval`), params);
}

/** 采购订单-审批 */
export function approval(params: {
  id: PurchaseOrder["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/purchase-order/approval`), params);
}

/** 采购订单-审批记录 */
export function getApprovalRecord(params: Pick<PurchaseOrder, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/purchase-order/approval-record`),
    params
  );
}

/** 采购订单-作废 */
export function billInvalid(params: Pick<PurchaseOrder, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-order/invalid`), params);
}

/** 采购订单-中止 */
export function billSuspend(params: Pick<PurchaseOrder, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-order/suspend`), params);
}

/** 采购订单-完结 */
export function billEnd(params: Pick<PurchaseOrder, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-order/end`), params);
}

/** 采购订单-撤销 */
export function cancelOperate(params: Pick<PurchaseOrder, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-order/cancel-operate`), params);
}

/** 采购订单-导出 */
export function purchaseOrderExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/purchase-order/export`), params);
}

/** 采购申请-操作记录 */
export function getOperateRecord(params: Pick<PurchaseOrder, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/purchase-order/log`),
    params
  );
}
