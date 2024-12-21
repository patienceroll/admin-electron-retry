import fetch from "src/util/fetch";

export const salesContractType = new Map<
  SalesContract["type"],
  EnumValue<SalesContract["type"]>
>([
  [1, { value: 1, color: "gold", text: "主合同" }],
  [2, { value: 2, color: "green", text: "补充协议" }],
]);
/**
 * 销售合同-列表
 */
export function getSalesContractList(
  params: ListParam & {
    status?: BillStatus;
    project_id?: Project["id"];
    client_id?: ClientListItem["id"];
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
  project_id?: Project["id"];
  client_id?: ClientListItem["id"];
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
  return fetch.GET<SalesContract>(
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
