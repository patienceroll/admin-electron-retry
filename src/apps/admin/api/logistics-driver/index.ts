import fetch from "src/util/fetch";

export const DriverStatus = new Map<
  Driver["status"],
  EnumValue<Driver["status"]>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 司机-列表
 */
export function getDriverList(params: ListParam) {
  return fetch.GET<List<Driver>>(fetch.base(`/api/driver/list`), params);
}

/**
 * 司机-详情
 */
export function getDriver(params: Pick<Driver, "id">) {
  return fetch.GET<Driver>(fetch.base(`/api/driver/detail`), params);
}

/**
 * 司机-添加
 */
export function addDriver(params: any) {
  return fetch.POST(fetch.base(`/api/driver`), params);
}

/**
 * 司机-编辑
 */
export function editDriver(params: any) {
  return fetch.PUT(fetch.base(`/api/driver`), params);
}

/**
 * 司机-删除
 */
export function deleteDriver(params: Pick<Driver, "id">) {
  return fetch.DELETE(fetch.base(`/api/driver`), params);
}
