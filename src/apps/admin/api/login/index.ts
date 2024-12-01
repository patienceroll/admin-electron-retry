import fetch from "src/util/fetch";

export const userStatus = new Map<User["status"], EnumValue<User["status"]>>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/** 登录 */
export function login(params: { account: string; password: string }) {
  return fetch.POST<{ token: string }>(fetch.base("/api/login"), params, {
    headers: { Authorization: "" },
  });
}

/** 获取用户信息 */
export function getUser() {
  return fetch.GET<User>(fetch.base(`/api/user/me`));
}

/** 获取当前用户的菜单 */
export function getUsersMenu() {
  return fetch.GET<UserMenu[]>(fetch.base("/api/menu/my-tree"));
}

export function getUserList(params: ListParam) {
  return fetch.GET<List<User>>(fetch.base(`/api/user/list`), params);
}
