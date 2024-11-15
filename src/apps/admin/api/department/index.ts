import fetch from "src/util/fetch";

export const DepartmentStatus = new Map<
  DepartmentListItemStatus,
  EnumValue<DepartmentListItemStatus>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 部门-列表
 */
export function getDepartmentList(
  params: ListParam<{
    company_id?: Company["id"];
    department_id?: DepartmentListItem["id"];
  }>
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
