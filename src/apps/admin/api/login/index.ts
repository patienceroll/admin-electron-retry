import fetch from "src/util/fetch";

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
