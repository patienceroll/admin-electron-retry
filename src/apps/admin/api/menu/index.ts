import fetch from "src/util/fetch";

/**
 * 菜单-树形图 */
export const getMenuTree = (params: {
  /** 1:手机 2:PC */
  type: 1 | 2;
}) => {
  return fetch.GET<Menu[]>(fetch.base("/api/menu/tree"), params);
};

/** 菜单-当前用户树形图 */
export const getUserMenuTree = () => {
  return fetch.GET<Menu[]>(fetch.base("/api/menu/my-tree"), undefined);
};

/**
 * 菜单-删除
 */
export const deleteMenu = (data: Pick<Menu, "id">) => {
  return fetch.DELETE(fetch.base("/api/menu"), data);
};

/**
 * 菜单权限-新增
 */
export const addMenuPermission = (data: {
  company_id: Company["id"];
  /** 1 - 手机   2 - pc */
  type: 1 | 2;
  pid?: Menu["id"];
  /** 1 - 菜单  2 - 页面 3- 隐藏页面 */
  level: 1 | 2 | 3;
  name: string;
  icon: string;
  path: string;
  /** 排序 */
  list: number;
  /** 状态 */
  is_hidden: 0 | 1;
}) => {
  return fetch.POST(fetch.base("/api/menu"), data);
};

/**
 * 菜单权限-编辑
 */
export const editMenuPermission = (data: {
  company_id: Company["id"];
  /** 1 - 手机   2 - pc */
  type: 1 | 2;
  pid?: Menu["id"];
  /** 1 - 菜单  2 - 页面 3- 隐藏页面 */
  level: 1 | 2 | 3;
  name: string;
  icon: string;
  path: string;
  /** 排序 */
  list: number;
  /** 状态 */
  is_hidden: 0 | 1;
  id: Menu["id"];
}) => {
  return fetch.PUT(fetch.base("/api/menu"), data);
};

/**
 * 菜单权限-列表
 */
export const getPermissions = (
  data: ListParam & {
    menu_id?: Menu["id"];
  }
) => {
  return fetch.GET<List<Permission>>(fetch.base("/api/permission/list"), data);
};

/**
 * 菜单权限-选项
 */
export const getPermissionsOption = (data: { menu_id?: Menu["id"] }) => {
  return fetch.GET<Permission[]>(fetch.base("/api/permission/list"), {
    ...data,
    page: 0,
  });
};

/**
 * 菜单权限-新增
 */
export const postPermission = (
  data: Pick<Permission, "name" | "slug" | "list"> & { menu_id: Menu["id"] }
) => {
  return fetch.POST(fetch.base("/api/permission"), data);
};

/**
 * 菜单权限-编辑
 */
export const putPermission = (
  data: Pick<Permission, "name" | "slug" | "list" | "id">
) => {
  return fetch.PUT(fetch.base("/api/permission"), data);
};

/**
 * 菜单权限-删除
 */
export const deletePermission = (data: Pick<Permission, "id">) => {
  return fetch.DELETE(fetch.base("/api/permission"), data);
};

export function setMenuStaff(params: {
  id: Menu["id"];
  staff_ids: Staff["id"][];
}) {
  return fetch.POST(fetch.base(`/api/menu/staff`), params);
}
