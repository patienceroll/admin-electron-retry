import fetch from "src/util/fetch";

/**
 * 七牛云文件上传token */
export function getQiniuToken() {
  return fetch.GET<{ token: string }>(fetch.base("/api/qiniuyun-token"));
}
