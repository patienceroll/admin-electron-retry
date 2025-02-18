import fetch from "src/util/fetch";

/**
 * 物资.弹窗 */
export const getSalesDeliverMaterialSku = (
  params: ListParam & {
    id?: SalesDeliver["id"];
    sales_order_id?: SalesDeliver["sales_order_id"];
  },
) => {
  return fetch.GET<List<SalesDeliverMaterialSku>>(
    fetch.base("/api/sales-deliver/inventory-material"),
    params,
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

/** 销售发货明细渲染字段 */
export function salesDeliverDetailRenderConfig(params: {
  sales_deliver_id: SalesDeliver["id"];
}) {
  return fetch.GET<RenderConfig>(
    fetch.base(`/api/sales-deliver-detail/render`),
    params,
  );
}
