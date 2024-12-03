import fetch from "src/util/fetch";

export const RoleStatus = new Map<
  RoleListItem["status"],
  EnumValue<RoleListItem["status"]>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 角色-编辑
 */
export const putRole = (
  data: Pick<RoleListItem, "company_id" | "name" | "status" | "slug" | "id">
) => {
  return fetch.PUT(fetch.base(`/api/role`), data);
};

/**
 * 角色-删除
 */
export const deleteRole = (data: Pick<Project, "id">) => {
  return fetch.DELETE(fetch.base(`/api/role`), data);
};

/**
 * 角色-列表
 */
export const getRoleList = (params: ListParam & { keyword?: string }) => {
  return fetch.GET<List<RoleListItem>>(fetch.base(`/api/role/list`), params);
};

/**
 * 角色-列表
 */
export const getRoleOptions = (params: ListParam & { keyword?: string }) => {
  return fetch.GET<RoleListItem[]>(fetch.base(`/api/role/list`), params);
};

/**
 * 角色-添加
 */
export const postRole = (
  data: Pick<RoleListItem, "company_id" | "name" | "status" | "slug">
) => {
  return fetch.POST(fetch.base(`/api/role`), data);
};

/**
 * 角色--详情
 */
export const getRole = (params: Pick<RoleListItem, "id">) => {
  return fetch.GET<RoleListItem>(fetch.base("/api/role/detail"), params);
};

/**
 * 角色菜单-批量添加/更新权限
 {role_id: Number, permission_ids: Array<Number>} */
export const postRoleMenus = (
  data: Pick<RoleListItem, "id"> & {
    permission_ids: Permission["id"][];
  }
) => {
  return fetch.POST(fetch.base(`/api/role-permission/batch-update`), data);
};

/**
 * 角色权限-编辑
 */
export const postRolePermissions = (data: {
  role_id: RoleListItem["id"];
  permission_ids: Permission["id"][];
}) => {
  return fetch.POST(fetch.base(`/api/role-permission/update`), data);
};

/**
 * 角色菜单-添加
 {role_id: Number, permission_id: Number} */
export const updateRolePermission = (
  data: Pick<RoleListItem, "id"> & {
    permission_id: Permission["id"];
  }
) => {
  return fetch.POST(fetch.base("/api/role-permission/update"), data);
};

/**
 * 角色菜单-树形
 */
export const getRoleMenu = (params: { role_id: RoleListItem["id"] }) => {
  return fetch.GET<RoleMenu[]>(fetch.base("/api/role-permission/tree"), params);
};

/** 角色数据权限修改 */
export function postRoleDataPermission(params: {
  role_id: RoleListItem["id"];
  menu_id: RoleMenu["id"];
  department_ids: Department["id"][];
}) {
  return fetch.POST(fetch.base(`/api/role-data-permission/update`), params);
}
