import fetch from "src/util/fetch";

/**
 * 员工-列表
 */
export function getStaffList(
  params: ListParam & { department_id?: Department["id"] }
) {
  return fetch.GET<List<StaffListItem>>(fetch.base(`/api/staff/list`), params);
}

/**
 * 员工-选项
 */
export function getStaffOption(params: { department_id?: Department["id"] }) {
  return fetch.GET<StaffListItem[]>(fetch.base(`/api/staff/list`), params);
}
