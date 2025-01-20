import buildQuery from "./build-query";

import controler from "src/framework/component/progress-bar/controler";
import contextedNotify from "../../framework/component/contexted-notify";

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

function getCurrentMenu(path: string) {
  function recusion(menu: UserMenu[], store: UserMenu[]) {
    menu.forEach((item) => {
      store.push(item);
      if (item.child) {
        recusion(item.child, store);
      }
    });
    return store;
  }
  const flatedMenu = recusion(window.preload.getLocalUserMenu() || [], []);
  const menu = flatedMenu.find((item) => item.path === path);
  return menu;
}

export const MenuSlug = {
  memoryRouterPath: "",
  get value() {
    if (window.preload.isPackaged) {
      const currentPath = `/${window.location.pathname
        .split("/")
        .filter(Boolean)
        .slice(0, 2)
        .join("/")}`;
      return getCurrentMenu(currentPath)?.slug;
    } else {
      const currentPath = `/${window.location.pathname
        .split("/")
        .filter(Boolean)
        .slice(1, 3)
        .join("/")}`;

      return getCurrentMenu(currentPath)?.slug;
    }
  },
};

function getDefaultHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + window.preload.getLocalToken(),
    Platform: "windows",
    "Company-Id": window.preload.getLocalCompany()?.id,
    "Menu-Slug": MenuSlug.value,
  };
}

function requestProgramResponse<T>(...argument: Parameters<typeof request>) {
  const [url, params, init = {}] = argument;

  const control = controler.push();

  const mergeInit: FetchInit = {
    ...init,
    headers: Object.assign(getDefaultHeader(), init.headers || {}),
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
      if (typeof err === "object" && err.type === "service-error") {
        const { data } = err as { data: BaseResponse };
        contextedNotify.notification?.error({
          description: data.message,
          message: "温馨提示",
        });
        if (data.status === 40001) {
          window.preload.login();
        }
      } else if (err instanceof DOMException && err.name === "AbortError") {
        // 排除掉 abort 错误
        console.log("用户取消请求");
      } else if (err instanceof Response) {
        const { status, statusText } = err;
        contextedNotify.notification?.error({
          description: `${status || ""}-${statusText || ""}`,
          message: "服务器错误",
        });
      } else if (err instanceof Error) {
        contextedNotify.notification?.error({
          description: `${err.message}`,
          message: "请检查网络环境",
        });
      }
      return Promise.reject(err);
    })
    .finally(control.resolve);
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
  base,
} as const;
