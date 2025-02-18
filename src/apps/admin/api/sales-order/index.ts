import fetch from "src/util/fetch";

export const salesOrderStatus = new Map<
  SalesContract["type"],
  EnumValue<SalesContract["type"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待执行" }],
  [2, { value: 2, color: "#d46b08", text: "执行中" }],
  [3, { value: 3, color: "#7cb305", text: "已完结" }],
  [4, { value: 4, color: "#cfc922", text: "已中止" }],
  [5, { value: 5, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 销售订单-列表
 */
export function getSalesOrderList(
  params: ListParam & {
    status?: SalesOrder["status"];
    sales_contract_id?: SalesContract["id"];
    /** 1客户 2项目 3合同 4订单 */
    statistics_type?: 1 | 2 | 3 | 4;
    statistics_id?: number | string;
    client_id?: Client["id"];
    is_show_detail?: 0 | 1;
    project_id?: Project["id"];
  }
) {
  return fetch.GET<List<SalesOrder>>(
    fetch.base(`/api/sales-order/list`),
    params
  );
}

/**
 * 销售订单选项 */
export function getSalesOrderOption(params: {
  status?: BillStatus;
  sales_contract_id?: SalesContract["id"];
  /** 1客户 2项目 3合同 4订单 */
  statistics_type?: 1 | 2 | 3 | 4;
  statistics_id?: number | string;
  client_id?: Client["id"];
  is_show_detail?: 0 | 1;
  statuses?: SalesOrder["status"][];
}) {
  return fetch.GET<SalesOrder[]>(fetch.base(`/api/sales-order/list`), params);
}

/**
 * 销售订单-详情
 */
export function getSalesOrder(params: Pick<SalesOrder, "id">) {
  return fetch.GET<SalesOrder>(fetch.base(`/api/sales-order/detail`), params);
}

/**
 * 销售订单-添加
 */
export function addSalesOrder(params: any) {
  return fetch.POST<SalesOrderAddResponse>(
    fetch.base(`/api/sales-order`),
    params
  );
}

/**
 * 销售订单-编辑
 */
export function editSalesOrder(params: any) {
  return fetch.PUT(fetch.base(`/api/sales-order`), params);
}

/**
 * 销售订单-删除
 */
export function deleteSalesOrder(params: Pick<SalesOrder, "id">) {
  return fetch.DELETE(fetch.base(`/api/sales-order`), params);
}

/**
 * 生成合同编号 */
export const getSalesOrderCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/sales-order/code")
  );
};

/**
 * 物资.弹窗 */
export const getSalesOrderMaterialSku = (
  params: ListParam & {
    sales_contract_id?: SalesOrder["sales_contract_id"];
    id?: SalesOrder["id"];
  }
) => {
  return fetch.GET<List<SalesOrderMaterialSku>>(
    fetch.base("/api/sales-order/superior-detail"),
    params
  );
};

/** 销售订单的可选择的产品 列渲染 */
export function salesOrdertMaterialRender(
  params: Parameters<typeof getSalesOrderMaterialSku>[0]
) {
  return fetch.GET<RenderConfig>(
    fetch.base(`/api/sales-contract/material-sku/render`),
    params
  );
}

/**
 * 物资.弹窗-保存
 */
export const postSalesOrderMaterialSku = (data: {
  id: SalesOrder["id"];
  ids: SalesOrderMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/sales-order/superior-detail"), data);
};

/** 销售订单-发起审批 */
export function startApproval(params: Pick<SalesOrder, "id">) {
  return fetch.POST(fetch.base(`/api/sales-order/start-approval`), params);
}

/** 销售订单-审批 */
export function approval(params: {
  id: SalesOrder["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/sales-order/approval`), params);
}

/** 销售订单-作废 */
export function billInvalid(params: Pick<SalesOrder, "id">) {
  return fetch.POST(fetch.base(`/api/sales-order/invalid`), params);
}

/** 销售订单-中止 */
export function billSuspend(params: Pick<SalesOrder, "id">) {
  return fetch.POST(fetch.base(`/api/sales-order/suspend`), params);
}

/** 销售订单-完结 */
export function billEnd(params: Pick<SalesOrder, "id">) {
  return fetch.POST(fetch.base(`/api/sales-order/end`), params);
}

/** 销售订单-撤销 */
export function cancelOperate(params: Pick<SalesOrder, "id">) {
  return fetch.POST(fetch.base(`/api/sales-order/cancel-operate`), params);
}

/** 销售订单-审批记录 */
export function getApprovalRecord(params: Pick<SalesOrder, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/sales-order/approval-record`),
    params
  );
}

/** 销售订单-导出 */
export function salesOrderExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/sales-order/export`), params);
}

/**
 * 物资.弹窗 */
export const getMaterialSku = (
  params: ListParam & {
    id?: SalesOrder["id"];
  }
) => {
  return fetch.GET<List<SalesOrderMaterialSku>>(
    fetch.base("/api/sales-order/material-sku"),
    params
  );
};

/**
 * 物资.弹窗-保存
 */
export const postMaterialSku = (data: {
  id: SalesOrder["id"];
  ids: SalesOrderMaterialSku["id"][];
  standard: string;
}) => {
  return fetch.POST(fetch.base("/api/sales-order/material-sku"), data);
};

/** 销售订单-操作记录 */
export function getOperateRecord(params: Pick<SalesOrder, "id">) {
  return fetch.GET<OperateRecord[]>(fetch.base(`/api/sales-order/log`), params);
}

/** 销售合同的可选择的产品 列渲染 */
export function salesOrderMaterialRender(
  params: Parameters<typeof getMaterialSku>[0]
) {
  return fetch.GET<RenderConfig>(
    fetch.base(`/api/sales-order/material-sku/render`),
    params
  );
}
