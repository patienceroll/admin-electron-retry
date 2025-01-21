import fetch from "src/util/fetch";
/**
 * 销售订单明细-列表
 */
export function getSalesOrderDetailList(
  params: ListParam & {
    sales_order_id?: SalesOrder["id"];
  }
) {
  return fetch.GET<List<SalesOrderDetail>>(
    fetch.base(`/api/sales-order-detail/list`),
    params
  );
}

/**
 * 销售订单明细-render数据 */
export function getSalesOrderDetailRender(params: {
  sales_order_id?: SalesOrder["id"];
  main_status?: BillStatus;
}) {
  return fetch.GET<ExcelTableData>(fetch.base(`/api/sales-order-detail/list`), {
    is_render: 1,
    ...params,
  });
}

/** 销售合同明细渲染字段 */
export function salesOrderDetailRenderConfig(params: {
  sales_order_id: SalesOrder["id"];
}) {
  return fetch.GET<RenderConfig>(
    fetch.base(`/api/sales-contract-detail/render`),
    params
  );
}

/**
 * 销售订单明细-render统计 */
export function getSalesOrderDetailRenderTotal(
  params: Parameters<typeof getSalesOrderDetailRender>[0]
) {
  return fetch.GET<{
    data: {
      num: { num: number; unit: string }[];
      amount: string;
    };
    html: string;
  }>(fetch.base(`/api/sales-order-detail/total`), params);
}

/**
 * 销售订单明细-详情
 */
export function getSalesOrderDetail(params: Pick<SalesOrderDetail, "id">) {
  return fetch.GET(fetch.base(`/api/sales-order-detail/detail`), params);
}

/**
 * 销售订单明细-添加
 */
export function addSalesOrderDetail(params: any) {
  return fetch.POST(fetch.base(`/api/sales-order-detail`), params);
}

/**
 * 销售订单明细-编辑
 */
export function editSalesOrderDetail(params: any) {
  return fetch.PUT(fetch.base(`/api/sales-order-detail`), params);
}

/**
 * 销售订单明细-删除
 */
export function deleteSalesOrderDetail(params: Pick<SalesOrderDetail, "id">) {
  return fetch.DELETE(fetch.base(`/api/sales-order-detail`), params);
}

/** 销售订单明细-导出 */
export function salesOrderDetailExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/sales-order-detail/export`), params);
}

/** 销售订单明细-获取物资执行单位  */
export function salesOrderDetailUnit(params: Pick<SalesOrderDetail, "id">) {
  return fetch.GET<Unit[]>(fetch.base(`/api/sales-order-detail/unit`), params);
}

/** 销售订单明细-设置物资执行单位 */
export function salesOrderDetailUnitSet(params: {
  demand_date?: string;
  remark: string;
  data: {
    /**
     * 是否执行单位;0:否,1:是
     */
    is_execute: number;
    /**
     * 物资单位id
     */
    material_unit_id: number;
    /**
     * 数量
     */
    num: number;
    /**
     * 单价
     */
    price: string;
  }[];
  id: SalesOrderDetail["id"];
}) {
  return fetch.POST(fetch.base(`/api/sales-order-detail/unit`), params);
}

/** 销售订单明细-获取物资执行单位（生产）  */
export function getProduceUnit(params: Pick<SalesOrderDetail, "id">) {
  return fetch.GET<Unit[]>(
    fetch.base(`/api/sales-order-detail/produce-unit`),
    params
  );
}

/** 销售订单明细-设置物资执行单位（生产） */
export function setProduceUnit(params: {
  remark: string;
  data: {
    /**
     * 是否执行单位;0:否,1:是
     */
    is_execute: number;
    /**
     * 物资单位id
     */
    material_unit_id: number;
    /**
     * 数量
     */
  }[];
  id: SalesOrderDetail["id"];
}) {
  return fetch.POST(fetch.base(`/api/sales-order-detail/produce-unit`), params);
}

/** 销售订单明细-获取物资执行单位（外购）  */
export function getPurchaseUnit(params: Pick<SalesOrderDetail, "id">) {
  return fetch.GET<Unit[]>(
    fetch.base(`/api/sales-order-detail/purchase-unit`),
    params
  );
}

/** 销售订单明细-设置物资执行单位（外购） */
export function setPurchaseUnit(params: {
  remark: string;
  data: {
    /**
     * 是否执行单位;0:否,1:是
     */
    is_execute: number;
    /**
     * 物资单位id
     */
    material_unit_id: number;
    /**
     * 数量
     */
  }[];
  id: SalesOrderDetail["id"];
}) {
  return fetch.POST(
    fetch.base(`/api/sales-order-detail/purchase-unit`),
    params
  );
}


