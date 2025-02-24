import fetch from "src/util/fetch";

export const purchaseReturnStatus = new Map<
  PurchaseReturn["status"],
  EnumValue<PurchaseReturn["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待退货" }],
  [2, { value: 2, color: "#d46b08", text: "退货中" }],
  [3, { value: 3, color: "#7cb305", text: "已退货" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 采购退货-列表
 */
export function getPurchaseReturnList(
  params: ListParam & {
    status?: BillStatus;
    /** 1客户 2项目 3合同 4订单 */
    statistics_type?: 1 | 2 | 3 | 4;
    statistics_id?: number | string;
  },
) {
  return fetch.GET<List<PurchaseReturn>>(
    fetch.base(`/api/purchase-return/list`),
    params,
  );
}

/**
 * 采购退货-详情
 */
export function getPurchaseReturn(params: Pick<PurchaseReturn, "id">) {
  return fetch.GET<PurchaseReturn>(
    fetch.base(`/api/purchase-return/detail`),
    params,
  );
}

/**
 * 采购退货-添加
 */
export function addPurchaseReturn(params: any) {
  return fetch.POST<PurchaseReturnAddResponse>(
    fetch.base(`/api/purchase-return`),
    params,
  );
}

/**
 * 采购退货-编辑
 */
export function editPurchaseReturn(params: any) {
  return fetch.PUT(fetch.base(`/api/purchase-return`), params);
}

/**
 * 采购退货-删除
 */
export function deletePurchaseReturn(params: Pick<PurchaseReturn, "id">) {
  return fetch.DELETE(fetch.base(`/api/purchase-return`), params);
}

/**
 * 生成合同编号 */
export const getPurchaseReturnCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/purchase-return/code"),
  );
};

/**
 * 物资.弹窗 */
export const getPurchaseReturnMaterialSku = (
  params: ListParam & {
    purchase_contract_id?: PurchaseReturn["purchase_contract_id"];
    id?: PurchaseReturn["id"];
    warehouse_id?: Warehouse["id"];
  },
) => {
  return fetch.GET<List<PurchaseReturnMaterialSku>>(
    fetch.base("/api/purchase-return/superior-detail"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postPurchaseReturnMaterialSku = (data: {
  id: PurchaseReturn["id"];
  ids: PurchaseReturnMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/purchase-return/superior-detail"), data);
};

/** 采购退货-发起审批 */
export function startApproval(params: Pick<PurchaseReturn, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-return/start-approval`), params);
}

/** 采购退货-审批 */
export function approval(params: {
  id: PurchaseReturn["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/purchase-return/approval`), params);
}

/** 采购退货-审批记录 */
export function getApprovalRecord(params: Pick<PurchaseReturn, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/purchase-return/approval-record`),
    params,
  );
}

/** 采购退货-作废 */
export function billInvalid(params: Pick<PurchaseReturn, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-return/invalid`), params);
}

/** 采购退货-撤销 */
export function cancelOperate(params: Pick<PurchaseReturn, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-return/cancel-operate`), params);
}

/** 采购退货-导出 */
export function purchaseReturnExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(
    fetch.base(`/api/purchase-return/export`),
    params,
  );
}

/** 采购退货-操作记录 */
export function getOperateRecord(params: Pick<PurchaseReturn, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/purchase-return/log`),
    params,
  );
}
