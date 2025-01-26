import fetch from "src/util/fetch";

export const salesDeliverStatus = new Map<
  SalesDeliver["status"],
  EnumValue<SalesDeliver["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待发货" }],
  [2, { value: 2, color: "#d46b08", text: "发货中" }],
  [3, { value: 3, color: "#3a50b9", text: "已发货" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 销售发货-列表
 */
export function getSalesDeliverList(
  params: ListParam & {
    status?: BillStatus;
    /** 1客户 2项目 3合同 4订单 */
    statistics_type?: 1 | 2 | 3 | 4;
    statistics_id?: number | string;
    client_id?: Client["id"];
    is_show_detail?: 0 | 1;
    project_id?: Project["id"];
    sales_contract_id?: SalesContract["id"];
  }
) {
  return fetch.GET<List<SalesDeliver>>(
    fetch.base(`/api/sales-deliver/list`),
    params
  );
}

/**
 * 销售发货-选项
 */
export function getSalesDeliverOption(params: {
  status?: BillStatus;
  /** 1客户 2项目 3合同 4订单 */
  statistics_type?: 1 | 2 | 3 | 4;
  statistics_id?: number | string;
  client_id?: Client["id"];
  is_show_detail?: 0 | 1;
}) {
  return fetch.GET<SalesDeliver[]>(
    fetch.base(`/api/sales-deliver/list`),
    params
  );
}

/**
 * 销售发货-详情
 */
export function getSalesDeliver(params: Pick<SalesDeliver, "id">) {
  return fetch.GET<SalesDeliver>(
    fetch.base(`/api/sales-deliver/detail`),
    params
  );
}

/**
 * 销售发货-添加
 */
export function addSalesDeliver(params: Pick<SalesOrder, "id">) {
  return fetch.POST<SalesDeliverAddResponse>(
    fetch.base(`/api/sales-deliver`),
    params
  );
}

/**
 * 销售发货-编辑
 */
export function editSalesDeliver(params: any) {
  return fetch.PUT(fetch.base(`/api/sales-deliver`), params);
}

/**
 * 销售发货-删除
 */
export function deleteSalesDeliver(params: Pick<SalesDeliver, "id">) {
  return fetch.DELETE(fetch.base(`/api/sales-deliver`), params);
}

/**
 * 生成合同编号 */
export const getSalesDeliverCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/sales-deliver/code")
  );
};

/**
 * 物资.弹窗 */
export const getSalesDeliverMaterialSku = (
  params: ListParam & {
    id?: SalesDeliver["id"];
    sales_order_id?: SalesDeliver["sales_order_id"];
  }
) => {
  return fetch.GET<List<SalesDeliverMaterialSku>>(
    fetch.base("/api/sales-deliver/inventory-material"),
    params
  );
};

/**
 * 物资.弹窗-保存
 */
export const postSalesDeliverMaterialSku = (data: {
  id: SalesDeliver["id"];
  ids: SalesDeliverMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/sales-deliver/inventory-material"), data);
};

/** 销售发货单-发起审批 */
export function startApproval(params: Pick<SalesDeliver, "id">) {
  return fetch.POST(fetch.base(`/api/sales-deliver/start-approval`), params);
}

/** 销售发货单-审批 */
export function approval(params: {
  id: SalesDeliver["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/sales-deliver/approval`), params);
}

/** 销售发货单-审批记录 */
export function getApprovalRecord(params: Pick<SalesDeliver, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/sales-deliver/approval-record`),
    params
  );
}

/** 销售发货单-作废 */
export function billInvalid(params: Pick<SalesDeliver, "id">) {
  return fetch.POST(fetch.base(`/api/sales-deliver/invalid`), params);
}

/** 销售发货单-撤销 */
export function cancelOperate(params: Pick<SalesDeliver, "id">) {
  return fetch.POST(fetch.base(`/api/sales-deliver/cancel-operate`), params);
}

/** 销售发货-导出 */
export function salesDeliverExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/sales-deliver/export`), params);
}

/** 销售发货-操作记录 */
export function getOperateRecord(params: Pick<SalesDeliver, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/sales-deliver/log`),
    params
  );
}
