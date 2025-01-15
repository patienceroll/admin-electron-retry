import fetch from "src/util/fetch";

export const purchaseReceiveStatus = new Map<
  PurchaseReceive["status"],
  EnumValue<PurchaseReceive["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待收货" }],
  [2, { value: 2, color: "#d46b08", text: "收货中" }],
  [3, { value: 3, color: "#7cb305", text: "已收货" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 采购收货-列表
 */
export function getPurchaseReceiveList(
  params: ListParam & {
    status?: BillStatus;
    supplier_id?: Supplier["id"];
    /** 1客户 2项目 3合同 4订单 */
    statistics_type?: 1 | 2 | 3 | 4;
    statistics_id?: number | string;
  },
) {
  return fetch.GET<List<PurchaseReceive>>(
    fetch.base(`/api/purchase-receive/list`),
    params,
  );
}

/**
 * 采购收货-详情
 */
export function getPurchaseReceive(params: Pick<PurchaseReceive, "id">) {
  return fetch.GET<PurchaseReceive>(
    fetch.base(`/api/purchase-receive/detail`),
    params,
  );
}

/**
 * 采购收货-添加
 */
export function addPurchaseReceive(params: any) {
  return fetch.POST<PurchaseReceiveAddResponse>(
    fetch.base(`/api/purchase-receive`),
    params,
  );
}

/**
 * 采购收货-编辑
 */
export function editPurchaseReceive(params: any) {
  return fetch.PUT(fetch.base(`/api/purchase-receive`), params);
}

/**
 * 采购收货-删除
 */
export function deletePurchaseReceive(params: Pick<PurchaseReceive, "id">) {
  return fetch.DELETE(fetch.base(`/api/purchase-receive`), params);
}

/**
 * 生成合同编号 */
export const getPurchaseReceiveCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/purchase-receive/code"),
  );
};

/**
 * 物资.弹窗 */
export const getPurchaseReceiveMaterialSku = (
  params: ListParam & {
    purchase_order_id?: PurchaseOrder["id"];
    id?: PurchaseReceive["id"];
  },
) => {
  return fetch.GET<List<PurchaseReceiveMaterialSku>>(
    fetch.base("/api/purchase-receive/superior-detail"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postPurchaseReceiveMaterialSku = (data: {
  id: PurchaseReceive["id"];
  ids: PurchaseReceiveMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/purchase-receive/superior-detail"), data);
};

/** 采购收货-发起审批 */
export function startApproval(params: Pick<PurchaseReceive, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-receive/start-approval`), params);
}

/** 采购收货-审批 */
export function approval(params: {
  id: PurchaseReceive["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/purchase-receive/approval`), params);
}

/** 采购收货-审批记录 */
export function getApprovalRecord(params: Pick<PurchaseReceive, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/purchase-receive/approval-record`),
    params,
  );
}

/** 采购收货-作废 */
export function billInvalid(params: Pick<PurchaseReceive, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-receive/invalid`), params);
}

/** 采购收货-撤销 */
export function cancelOperate(params: Pick<PurchaseReceive, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-receive/cancel-operate`), params);
}

/** 采购收货-导出 */
export function purchaseReceiveExport(params: Record<string, any>) {
  return fetch.GET<ExportRes>(
    fetch.base(`/api/purchase-receive/export`),
    params,
  );
}

/** 采购申请-操作记录 */
export function getOperateRecord(params: Pick<PurchaseReceive, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/purchase-receive/log`),
    params,
  );
}
