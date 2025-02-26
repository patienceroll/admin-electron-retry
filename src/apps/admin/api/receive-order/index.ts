import fetch from "src/util/fetch";

export const receiveOrderStatus = new Map<
  ReceiveOrder["status"],
  EnumValue<ReceiveOrder["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待收货" }],
  [2, { value: 2, color: "#d46b08", text: "收货中" }],
  [3, { value: 3, color: "#7cb305", text: "已收货" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 收货单-列表
 */
export function getReceiveOrderList(
  params: ListParam & { status?: ReceiveOrder["status"] }
) {
  return fetch.GET<List<ReceiveOrder>>(
    fetch.base(`/api/receive-order/list`),
    params
  );
}

/**
 * 收货单-详情
 */
export function getReceiveOrder(params: Pick<ReceiveOrder, "id">) {
  return fetch.GET<ReceiveOrder>(
    fetch.base(`/api/receive-order/detail`),
    params
  );
}

/** 收货单-开始收货*/
export function billStart(params: Pick<ReceiveOrder, "id">) {
  return fetch.POST(fetch.base(`/api/receive-order/start`), params);
}

/** 收货单-部分入库 */
export function billPartEnd(params: Pick<ReceiveOrder, "id">) {
  return fetch.POST(fetch.base(`/api/receive-order/part-end`), params);
}

/** 收货单-完成收货 */
export function billEnd(params: Pick<ReceiveOrder, "id">) {
  return fetch.POST(fetch.base(`/api/receive-order/end`), params);
}

/** 收货单-撤销 */
export function cancelOperate(params: Pick<ReceiveOrder, "id">) {
  return fetch.POST(fetch.base(`/api/receive-order/cancel-operate`), params);
}

/** 收货单-导出 */
export function receiveOrderExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/receive-order/export`), params);
}

/** 收货单-操作记录 */
export function getOperateRecord(params: Pick<ReceiveOrder, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/receive-order/log`),
    params
  );
}
