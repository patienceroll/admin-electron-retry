import fetch from "src/util/fetch";

export const salesReturnStatus = new Map<
  SalesDeliver["status"],
  EnumValue<SalesDeliver["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待退货" }],
  [2, { value: 2, color: "#d46b08", text: "退货中" }],
  [3, { value: 3, color: "#3a50b9", text: "已退货" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 销售退款-列表
 */
export function getSalesReturnList(
  params: ListParam & {
    status?: BillStatus;
    /** 1客户 2项目 3合同 4订单 */
    statistics_type?: 1 | 2 | 3 | 4;
    statistics_id?: number | string;
    client_id?: Client["id"];
    is_show_detail?: 0 | 1;
    project_id?: Project["id"];
  }
) {
  return fetch.GET<List<SalesReturn>>(
    fetch.base(`/api/sales-return/list`),
    params
  );
}

/**
 * 销售退款-详情
 */
export function getSalesReturn(params: Pick<SalesReturn, "id">) {
  return fetch.GET<SalesReturn>(fetch.base(`/api/sales-return/detail`), params);
}

/**
 * 销售退款-添加
 */
export function addSalesReturn(params: any) {
  return fetch.POST<
    Pick<
      SalesReturn,
      | "company_id"
      | "client_id"
      | "project_id"
      | "code"
      | "status"
      | "created_id"
      | "created_at"
      | "updated_at"
      | "id"
      | "status_show"
    >
  >(fetch.base(`/api/sales-return`), params);
}

/**
 * 销售退款-编辑
 */
export function editSalesReturn(params: any) {
  return fetch.PUT(fetch.base(`/api/sales-return`), params);
}

/**
 * 销售退款-删除
 */
export function deleteSalesReturn(params: Pick<SalesReturn, "id">) {
  return fetch.DELETE(fetch.base(`/api/sales-return`), params);
}

/**
 * 生成合同编号 */
export const getSalesReturnCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/sales-return/code")
  );
};

/**
 * 物资.弹窗 */
export const getSalesReturnMaterialSku = (
  params: ListParam & {
    id?: SalesReturn["id"];
    sales_deliver_id?: SalesReturn["sales_deliver_id"];
  }
) => {
  return fetch.GET<List<SalesReturnMaterialSku>>(
    fetch.base("/api/sales-return/superior-detail"),
    params
  );
};

/**
 * 物资.弹窗-保存
 */
export const postSalesReturnMaterialSku = (data: {
  id: SalesReturn["id"];
  ids: SalesReturnMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/sales-return/superior-detail"), data);
};

/** 销售退货-发起审批 */
export function startApproval(params: Pick<SalesReturn, "id">) {
  return fetch.POST(fetch.base(`/api/sales-return/start-approval`), params);
}

/** 销售退货-审批 */
export function approval(params: {
  id: SalesReturn["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/sales-return/approval`), params);
}

/** 销售退货-审批记录 */
export function getApprovalRecord(params: Pick<SalesReturn, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/sales-return/approval-record`),
    params
  );
}

/** 销售退货-作废 */
export function billInvalid(params: Pick<SalesReturn, "id">) {
  return fetch.POST(fetch.base(`/api/sales-return/invalid`), params);
}

/** 销售退货-撤销 */
export function cancelOperate(params: Pick<SalesReturn, "id">) {
  return fetch.POST(fetch.base(`/api/sales-return/cancel-operate`), params);
}

/** 销售退货-导出 */
export function salesReturnExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/sales-return/export`), params);
}

/** 销售退货-操作记录 */
export function getOperateRecord(params: Pick<SalesReturn, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/sales-return/log`),
    params
  );
}
