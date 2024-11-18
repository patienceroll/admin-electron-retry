// import env from "src/client/env";

export default {
  /** 打开当前应用的某一个页面为窗口 */
  openCurrentAppWindow(...params: Parameters<typeof window.open>) {
    const [hashPath, target = "_blank", futures] = params;
    const { origin, pathname } = location;
    return window.open(origin + pathname + "#" + hashPath, target, futures);
  },
};
