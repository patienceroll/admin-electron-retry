import fetch from "src/util/fetch";

export const purchaseApplyStatus = new Map<
  PurchaseApply["type"],
  EnumValue<PurchaseApply["type"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待执行" }],
  [2, { value: 2, color: "#d46b08", text: "执行中" }],
  [3, { value: 3, color: "#7cb305", text: "已完结" }],
  [5, { value: 5, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 采购申请-列表
 */
export function getPurchaseApplyList(
  params: ListParam & {
    status?: BillStatus;
    type?: number;
  },
) {
  return fetch.GET<List<PurchaseApply>>(
    fetch.base(`/api/purchase-apply/list`),
    params,
  );
}
/**
 * 采购申请-选项
 */
export function getPurchaseApplyOptions(
  params: ListParam & {
    status?: BillStatus;
    type?: number;
    statuses?:PurchaseApply['status'][]
  },
) {
  return fetch.GET<PurchaseApply[]>(
    fetch.base(`/api/purchase-apply/list`),
    params,
  );
}

/**
 * 采购申请-详情
 */
export function getPurchaseApply(params: Pick<PurchaseApply, "id">) {
  return fetch.GET<PurchaseApply>(
    fetch.base(`/api/purchase-apply/detail`),
    params,
  );
}

/**
 * 采购申请-添加
 */
export function addPurchaseApply(params: any) {
  return fetch.POST<PurchaseApplyAddResponse>(
    fetch.base(`/api/purchase-apply`),
    params,
  );
}

/**
 * 采购申请-编辑
 */
export function editPurchaseApply(params: any) {
  return fetch.PUT(fetch.base(`/api/purchase-apply`), params);
}

/**
 * 采购申请-删除
 */
export function deletePurchaseApply(params: Pick<PurchaseApply, "id">) {
  return fetch.DELETE(fetch.base(`/api/purchase-apply`), params);
}

/**
 * 生成合同编号 */
export const getPurchaseApplyCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/purchase-apply/code"),
  );
};

/**
 * 物资.弹窗 */
export const getPurchaseApplyMaterialSku = (
  params: ListParam & {
    id?: PurchaseApply["id"];
  },
) => {
  return fetch.GET<List<PurchaseApplyMaterialSku>>(
    fetch.base("/api/purchase-apply/material-sku"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postPurchaseApplyMaterialSku = (data: {
  id: PurchaseApply["id"];
  ids: PurchaseApplyMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/purchase-apply/material-sku"), data);
};

/** 采购申请-发起审批 */
export function startApproval(params: Pick<PurchaseApply, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-apply/start-approval`), params);
}

/** 采购申请-审批 */
export function approval(params: {
  id: PurchaseApply["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/purchase-apply/approval`), params);
}

/** 采购申请-审批记录 */
export function getApprovalRecord(params: Pick<PurchaseApply, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/purchase-apply/approval-record`),
    params,
  );
}

/** 采购申请-作废 */
export function billInvalid(params: Pick<PurchaseApply, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-apply/invalid`), params);
}

/** 采购申请-完结 */
export function billEnd(params: Pick<PurchaseApply, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-apply/end`), params);
}

/** 销售合同-撤销 */
export function cancelOperate(params: Pick<PurchaseApply, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-apply/cancel-operate`), params);
}

/** 采购申请-导出 */
export function purchaseApplyExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/purchase-apply/export`), params);
}

/** 采购申请-操作记录 */
export function getOperateRecord(params: Pick<PurchaseApply, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/purchase-apply/log`),
    params,
  );
}
