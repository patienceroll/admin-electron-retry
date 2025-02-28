import fetch from "src/util/fetch";

/**
 * 销售退款明细-列表
 */
export function getSalesReturnDetailList(
  params: ListParam & {
    sales_return_id?: SalesReturn["id"];
  },
) {
  return fetch.GET<List<SalesReturnDetail>>(
    fetch.base(`/api/sales-return-detail/list`),
    params,
  );
}

/**
 * 销售退款明细-render数据
 */
export function getSalesReturnDetailRender(
  params: ListParam & {
    sales_return_id?: SalesReturn["id"];
  },
) {
  return fetch.GET<List<SalesReturnDetail>>(
    fetch.base(`/api/sales-return-detail/list`),
    {
      is_render: 1,
      ...params,
    },
  );
}

// /**
//  * 销售退款明细-列表(不分页)
//  */
// export function getSalesReturnDetailNoPage(
//   params: NoPageParams<{
//     sales_order_detail_id?: SalesOrderDetail["id"];
//   }>,
// ) {
//   return fetch.GET<SalesReturnDetail[]>(
//     fetch.base(`/api/sales-return-detail/list`),
//     params,
//   );
// }

/**
 * 销售退款明细-详情
 */
export function getSalesReturnDetail(params: Pick<SalesReturnDetail, "id">) {
  return fetch.GET<SalesReturnDetail>(
    fetch.base(`/api/sales-return-detail/detail`),
    params,
  );
}

/**
 * 销售退款明细-添加
 */
export function addSalesReturnDetail(params: any) {
  return fetch.POST(fetch.base(`/api/sales-return-detail`), params);
}

/**
 * 销售退货明细-编辑
 */
export function editSalesReturnDetail(params: {
  id: SalesReturnDetail["id"];
  num: SalesReturnDetail["num"];
  price: SalesReturnDetail["price"];
  remark?: SalesReturnDetail["remark"];
}) {
  return fetch.PUT(fetch.base(`/api/sales-return-detail`), params);
}

/**
 * 销售退款明细-删除
 */
export function deleteSalesReturnDetail(params: Pick<SalesReturnDetail, "id">) {
  return fetch.DELETE(fetch.base(`/api/sales-return-detail`), params);
}

/** 销售退货单明细-导出 */
export function salesReturnExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/sales-return-detail/export`), params);
}

/** 销售退货明细-获取物资执行单位  */
export function salesReturnDetailUnit(params: Pick<SalesReturnDetail, "id">) {
  return fetch.GET<Unit[]>(fetch.base(`/api/sales-return-detail/unit`), params);
}

/** 销售退货明细-设置物资执行单位 */
export function salesReturnDetailUnitSet(params: {
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
  id: SalesReturnDetail["id"];
}) {
  return fetch.POST(fetch.base(`/api/sales-return-detail/unit`), params);
}

/** 销售退货明细渲染字段 */
export function salesReturnDetailRenderConfig(params: {
  sales_return_id: SalesReturn["id"];
}) {
  return fetch.GET<RenderConfig>(
    fetch.base(`/api/sales-return-detail/render`),
    params,
  );
}
