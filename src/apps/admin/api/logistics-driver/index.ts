import fetch from "@/utils/fetch";

/**
 * 司机-列表
 */
export function getDriverList(params: BaseListParam) {
  return fetch.get<List<Driver>>(fetch.base(`/api/driver/list`), params);
}

/**
 * 司机-详情
 */
export function getDriver(params: Pick<Driver, "id">) {
  return fetch.get<Driver>(fetch.base(`/api/driver/detail`), params);
}

/**
 * 司机-添加
 */
export function addDriver(params: any) {
  return fetch.post(fetch.base(`/api/driver`), params);
}

/**
 * 司机-编辑
 */
export function editDriver(params: any) {
  return fetch.put(fetch.base(`/api/driver`), params);
}

/**
 * 司机-删除
 */
export function deleteDriver(params: Pick<Driver, "id">) {
  return fetch.del(fetch.base(`/api/driver`), params);
}
