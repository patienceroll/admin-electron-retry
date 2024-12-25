import fetch from "src/util/fetch";

/**
 * 发货单-列表
 */
export function getDeliverOrderList(params: ListParam) {
  return fetch.GET<List<DeliverOrder>>(
    fetch.base(`/api/deliver-order/list`),
    params,
  );
}

/**
 * 发货单-详情
 */
export function getDeliverOrder(params: Pick<DeliverOrder, "id">) {
  return fetch.GET<DeliverOrder>(
    fetch.base(`/api/deliver-order/detail`),
    params,
  );
}

/**
 * 发货单-添加
 */
export function addDeliverOrder(params: any) {
  return fetch.POST(fetch.base(`/api/deliver-order`), params);
}

/**
 * 发货单-编辑
 */
export function editDeliverOrder(params: any) {
  return fetch.PUT(fetch.base(`/api/deliver-order`), params);
}

/**
 * 发货单-删除
 */
export function deleteDeliverOrder(params: Pick<DeliverOrder, "id">) {
  return fetch.DELETE(fetch.base(`/api/deliver-order`), params);
}

/** 发货单-开始发货*/
export function billStart(params: Pick<DeliverOrder, "id">) {
  return fetch.POST(fetch.base(`/api/deliver-order/start`), params);
}

/** 发货单-完成发货 */
export function billEnd(params: Pick<DeliverOrder, "id">) {
  return fetch.POST(fetch.base(`/api/deliver-order/end`), params);
}

/** 发货单-撤销 */
export function cancelOperate(params: Pick<DeliverOrder, "id">) {
  return fetch.POST(fetch.base(`/api/deliver-order/cancel-operate`), params);
}

/** 发货单-导出 */
export function deliverOrderExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/deliver-order/export`), params);
}

/** 发货单-操作记录 */
export function getOperateRecord(params: Pick<DeliverOrder, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/deliver-order/log`),
    params,
  );
}
