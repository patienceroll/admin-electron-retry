import { message } from "antd";
import buildQuery from "./build-query";

function isIntanceofBodyInit(data: unknown) {
  return (
    data instanceof ReadableStream ||
    data instanceof Blob ||
    data instanceof ArrayBuffer ||
    data instanceof FormData ||
    data instanceof URLSearchParams ||
    typeof data === "string"
  );
}

function request(url: string, params?: FetchParams, init: FetchInit = {}) {
  let query: string | undefined;
  let body: RequestInit["body"];
  const { method = "GET", paramsSerializer } = init;

  if (["GET", "DELETE", "HEAD"].includes(method)) {
    if (params)
      query = paramsSerializer
        ? paramsSerializer(params as Exclude<FetchParams, BodyInit>)
        : buildQuery(params as Exclude<FetchParams, BodyInit>);
  } else if (["POST", "PUT", "PATCH"].includes(method)) {
    if (isIntanceofBodyInit(params)) body = params as BodyInit;
    else body = JSON.stringify(params as Exclude<FetchParams, BodyInit>);
  }

  return fetch(query ? `${url}?${query}` : url, { ...init, method, body });
}

function getDefaultHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
    Platform: "windows",
    "Company-Id": localStorage.getItem("company_id") || "",
  };
}

function requestProgramResponse<T>(...argument: Parameters<typeof request>) {
  const [url, params, init = {}] = argument;

  const mergeInit: FetchInit = {
    ...init,
    headers: Object.assign({}, getDefaultHeader(), { "Menu-Slug": "" }),
  };

  /** 当请求传递的是 FormData 的时候,删除 Content-Type  */
  if (
    params instanceof FormData &&
    mergeInit.headers &&
    (mergeInit.headers as any)["Content-Type"]
  ) {
    delete (mergeInit.headers as any)["Content-Type"];
  }

  return request(url, params, mergeInit)
    .then((res) => {
      if (res.ok) return res.json();
      return Promise.reject(res);
    })
    .then((res: BaseResponse<T>) => {
      if (res.status === 0) return res;
      return Promise.reject({
        type: "service-error",
        data: res,
      });
    })
    .catch((err) => {
      const { headers } = mergeInit;
      const showMessage =
        (headers as Record<string, string>).hideMessage !== "true";

      if (typeof err === "object" && err.type === "service-error") {
        const { data } = err as { data: BaseResponse };
        if (showMessage) message.error(data.message);

        if (data.status === 40001 && location.pathname !== "/login") {
          window.preload.login();
        }
      } else if (err instanceof DOMException && err.name === "AbortError") {
        // 排除掉 abort 错误
        console.log("用户取消请求");
      } else {
        const { status, statusText } = err as Response;
        // 接口请求错误
        if (err instanceof Error) {
          message.error(`服务器发生错误:${err.message}`);
        } else {
          message.error(`服务器发生错误:${status || ""}-${statusText || ""}`);
        }
      }

      return Promise.reject(err);
    });
}

/**
 * ### 发起get请求 */
function GET<T>(...argument: Parameters<typeof request>) {
  const [url, params = {}, init = {}] = argument;
  init.method = "GET";
  return requestProgramResponse<T>(url, params, init);
}
/**
 * ### post */
function POST<T>(...argument: Parameters<typeof request>) {
  const [url, params = {}, init = {}] = argument;
  init.method = "POST";
  return requestProgramResponse<T>(url, params, init);
}

/**
 * ### put */
function PUT<T>(...argument: Parameters<typeof request>) {
  const [url, params = {}, init = {}] = argument;
  init.method = "PUT";
  return requestProgramResponse<T>(url, params, init);
}

/**
 * ### delete */
function DELETE<T>(...argument: Parameters<typeof request>) {
  const [url, params = {}, init = {}] = argument;
  init.method = "DELETE";
  return requestProgramResponse<T>(url, params, init);
}

/**
 * ### patch */
function PATCH<T>(...argument: Parameters<typeof request>) {
  const [url, params = {}, init = {}] = argument;
  init.method = "PATCH";
  return requestProgramResponse<T>(url, params, init);
}

function base(path: string) {
  // if (env === "test") return Config.test.baseUrl + path;
  // if (env === "newtest") return Config.newtest.baseUrl + path;
  // if (env === "production") return Config.production.baseUrl + path;
  return "http://118.89.67.217:9638" + path;
  throw new Error("错误的环境");
}

export default {
  GET,
  POST,
  PUT,
  buildQuery,
  DELETE,
  PATCH,
  requestProgramResponse,
  base
};
