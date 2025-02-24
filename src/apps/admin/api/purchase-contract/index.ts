import fetch from "src/util/fetch";

export const purchaseContractStatus = new Map<
  PurchaseContract["status"],
  EnumValue<PurchaseContract["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待执行" }],
  [2, { value: 2, color: "#d46b08", text: "执行中" }],
  [3, { value: 3, color: "#7cb305", text: "已完结" }],
  [4, { value: 4, color: "#cfc922", text: "已中止" }],
  [5, { value: 5, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 采购合同-列表
 */
export function getPurchaseContractList(
  params: ListParam & {
    status?: BillStatus;
    supplier_id?: Supplier["id"];
  },
) {
  return fetch.GET<List<PurchaseContract>>(
    fetch.base(`/api/purchase-contract/list`),
    params,
  );
}
/**
 * 采购合同-选项
 */
export function getPurchaseContractOption(
  params: ListParam & {
    status?: BillStatus;
    supplier_id?: Supplier["id"];
  },
) {
  return fetch.GET<PurchaseContract[]>(
    fetch.base(`/api/purchase-contract/list`),
    params,
  );
}

/**
 * 采购合同-详情
 */
export function getPurchaseContract(params: Pick<PurchaseContract, "id">) {
  return fetch.GET<PurchaseContract>(
    fetch.base(`/api/purchase-contract/detail`),
    params,
  );
}

/**
 * 采购合同-添加
 */
export function addPurchaseContract(params: any) {
  return fetch.POST<PurchaseContractAddResponse>(
    fetch.base(`/api/purchase-contract`),
    params,
  );
}

/**
 * 采购合同-编辑
 */
export function editPurchaseContract(params: any) {
  return fetch.PUT(fetch.base(`/api/purchase-contract`), params);
}

/**
 * 采购合同-删除
 */
export function deletePurchaseContract(params: Pick<PurchaseContract, "id">) {
  return fetch.DELETE(fetch.base(`/api/purchase-contract`), params);
}

/**
 * 生成合同编号 */
export const getPurchaseContractCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/purchase-contract/code"),
  );
};

/**
 * 物资.弹窗 */
export const getPurchaseContractMaterialSku = (
  params: ListParam & {
    id?: PurchaseContract["id"];
  },
) => {
  return fetch.GET<List<PurchaseContractMaterialSku>>(
    fetch.base("/api/purchase-contract/material-sku"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postPurchaseContractMaterialSku = (data: {
  id: PurchaseContract["id"];
  ids: PurchaseContractMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/purchase-contract/material-sku"), data);
};

/** 采购合同-发起审批 */
export function startApproval(params: Pick<PurchaseContract, "id">) {
  return fetch.POST(
    fetch.base(`/api/purchase-contract/start-approval`),
    params,
  );
}

/** 采购合同-审批 */
export function approval(params: {
  id: PurchaseContract["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/purchase-contract/approval`), params);
}

/** 采购合同-作废 */
export function billInvalid(params: Pick<PurchaseContract, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-contract/invalid`), params);
}

/** 采购合同-中止 */
export function billSuspend(params: Pick<PurchaseContract, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-contract/suspend`), params);
}

/** 采购合同-完结 */
export function billEnd(params: Pick<PurchaseContract, "id">) {
  return fetch.POST(fetch.base(`/api/purchase-contract/end`), params);
}

/** 采购合同-撤销 */
export function cancelOperate(params: Pick<PurchaseContract, "id">) {
  return fetch.POST(
    fetch.base(`/api/purchase-contract/cancel-operate`),
    params,
  );
}

/** 采购合同-审批记录 */
export function getApprovalRecord(params: Pick<PurchaseContract, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/purchase-contract/approval-record`),
    params,
  );
}

/** 采购合同-导出 */
export function purchaseContractExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(
    fetch.base(`/api/purchase-contract/export`),
    params,
  );
}

/** 采购申请-操作记录 */
export function getOperateRecord(params: Pick<PurchaseContract, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/purchase-contract/log`),
    params,
  );
}
