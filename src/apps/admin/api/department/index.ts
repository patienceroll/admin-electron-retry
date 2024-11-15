import fetch from "src/util/fetch";

/**
 * 部门-列表
 */
export function getDepartmentList(
  params: ListParam<{ company_id?: Company["id"] }>
) {
  return fetch.GET<List<DepartmentListItem>>(
    fetch.base(`/api/department/list`),
    params
  );
}

/**
 * 部门-详情
 */
export function getDepartmentDetail(params: Pick<DepartmentListItem, "id">) {
  return fetch.GET<DepartmentListItem>(
    fetch.base(`/api/department/detail`),
    params
  );
}

/**
 * 部门-添加
 */
export function addDepartment(params: any) {
  return fetch.POST(fetch.base(`/api/department`), params);
}

/**
 * 部门-编辑
 */
export function editDepartment(params: any) {
  return fetch.POST(fetch.base(`/api/department`), params);
}

/**
 * 部门-删除
 */
export function deleteDepartment(params: Pick<DepartmentListItem, "id">) {
  return fetch.DELETE(fetch.base(`/api/department`), params);
}

/**
 * 部门-树形 */
export function getDepartmentTree() {
  return fetch.GET<DepartmentTreeItem[]>(fetch.base(`/api/department/tree`));
}
