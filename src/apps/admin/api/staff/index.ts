import fetch from "src/util/fetch";

/**
 * 员工-列表
 */
export function getStaffList(
  params: ListParam & { department_id?: DepartmentListItem["id"] }
) {
  return fetch.GET<List<StaffListItem>>(fetch.base(`/api/staff/list`), params);
}

/**
 * 员工-选项
 */
export function getStaffOption(params: {
  department_id?: DepartmentListItem["id"];
}) {
  return fetch.GET<StaffListItem[]>(fetch.base(`/api/staff/list`), params);
}

/**
 * 员工-详情
 */
export function getStaffDetail(params: Pick<StaffListItem, "id">) {
  return fetch.GET<StaffListItem>(fetch.base(`/api/staff/detail`), params);
}

/**
 * 员工-添加
 */
export function addStaff(params: any) {
  return fetch.POST(fetch.base(`/api/staff`), params);
}

/**
 * 员工-编辑
 */
export function editStaff(params: any) {
  return fetch.PUT(fetch.base(`/api/staff`), params);
}

/**
 * 员工-删除
 */
export function deleteStaff(params: Pick<StaffListItem, "id">) {
  return fetch.DELETE(fetch.base(`/api/staff`), params);
}
