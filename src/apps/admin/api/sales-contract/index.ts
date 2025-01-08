import fetch from "src/util/fetch";

export const salesContractType = new Map<
  SalesContract["type"],
  EnumValue<SalesContract["type"]>
>([
  [1, { value: 1, color: "gold", text: "主合同" }],
  [2, { value: 2, color: "green", text: "补充协议" }],
]);

export const salesContractStatus = new Map<
  SalesContract["status"],
  EnumValue<SalesContract["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待执行" }],
  [2, { value: 2, color: "#d46b08", text: "执行中" }],
  [3, { value: 3, color: "#7cb305", text: "已完结" }],
  [4, { value: 4, color: "#cfc922", text: "已中止" }],
  [5, { value: 5, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 销售合同-列表
 */
export function getSalesContractList(
  params: ListParam & {
    status?: SalesContract["status"];
    project_id?: Project["id"];
    client_id?: Client["id"];
    is_show_detail?: 0 | 1;
  }
) {
  return fetch.GET<List<SalesContract>>(
    fetch.base(`/api/sales-contract/list`),
    params
  );
}

/**
 * 销售合同-选项
 */
export function getSalesContractOption(params: {
  status?: BillStatus;
  statuses?: SalesContract["status"][];
  project_id?: Project["id"];
  client_id?: Client["id"];
  is_show_detail?: 0 | 1;
}) {
  return fetch.GET<SalesContract[]>(
    fetch.base(`/api/sales-contract/list`),
    params
  );
}

/**
 * 销售合同-详情
 */
export function getSalesContract(params: Pick<SalesContract, "id">) {
  return fetch.GET<SalesContractDetail>(
    fetch.base(`/api/sales-contract/detail`),
    params
  );
}

/**
 * 销售合同-添加
 */
export function addSalesContract(params: any) {
  return fetch.POST<SalesContractAddResponse>(
    fetch.base(`/api/sales-contract`),
    params
  );
}

/**
 * 销售合同-编辑
 */
export function editSalesContract(params: any) {
  return fetch.PUT(fetch.base(`/api/sales-contract`), params);
}

/**
 * 销售合同-删除
 */
export function deleteSalesContract(params: Pick<SalesContract, "id">) {
  return fetch.DELETE(fetch.base(`/api/sales-contract`), params);
}

/**
 * 生成合同编号 */
export const getSalesContractCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/sales-contract/code")
  );
};

/**
 * 物资.弹窗 */
export const getMaterialSku = (
  params: ListParam & {
    id?: SalesContract["id"];
    material_classify_id?: MaterialClassify['id']
  }
) => {
  return fetch.GET<List<SalesContractMaterialSku>>(
    fetch.base("/api/sales-contract/material-sku"),
    params
  );
};

/**
 * 物资.弹窗-保存
 */
export const postMaterialSku = (data: {
  id: SalesContract["id"];
  ids: SalesContractMaterialSku["id"][];
  standard: string;
}) => {
  return fetch.POST(fetch.base("/api/sales-contract/material-sku"), data);
};

/** 销售合同-发起审批 */
export function startApproval(params: Pick<SalesContract, "id">) {
  return fetch.POST(fetch.base(`/api/sales-contract/start-approval`), params);
}

/** 销售合同-审批 */
export function approval(params: {
  id: SalesContract["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/sales-contract/approval`), params);
}

/** 销售合同-作废 */
export function billInvalid(params: Pick<SalesContract, "id">) {
  return fetch.POST(fetch.base(`/api/sales-contract/invalid`), params);
}

/** 销售合同-中止 */
export function billSuspend(params: Pick<SalesContract, "id">) {
  return fetch.POST(fetch.base(`/api/sales-contract/suspend`), params);
}

/** 销售合同-完结 */
export function billEnd(params: Pick<SalesContract, "id">) {
  return fetch.POST(fetch.base(`/api/sales-contract/end`), params);
}

/** 销售合同-撤销 */
export function cancelOperate(params: Pick<SalesContract, "id">) {
  return fetch.POST(fetch.base(`/api/sales-contract/cancel-operate`), params);
}

/** 销售合同-审批记录 */
export function getApprovalRecord(params: Pick<SalesContract, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/sales-contract/approval-record`),
    params
  );
}

/** 销售合同-导出 */
export function salesContractExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/sales-contract/export`), params);
}

/** 销售合同 操作记录 */
export function getOperateRecord(params: Pick<SalesContract, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/sales-contract/log`),
    params
  );
}
