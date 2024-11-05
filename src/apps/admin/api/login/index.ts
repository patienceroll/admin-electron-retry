import fetch from "src/util/fetch";

/** 登录 */
export function login(params: { account: string; password: string }) {
  return fetch.POST<{ token: string }>(fetch.base("/api/login"), params);
}
