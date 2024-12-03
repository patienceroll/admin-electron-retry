// import env from "src/client/env";

import dayjs from "dayjs";

export default {
  /** 打开当前应用的某一个页面为窗口 */
  openCurrentAppWindow(...params: Parameters<typeof window.open>) {
    const [hashPath, target = "_blank", futures] = params;
    const { origin, pathname } = location;
    const win = window.open(
      origin + pathname + "#" + hashPath,
      target === "_blank"
        ? "_blank"
        // 这里加个时间是因为同一个路由会合并,并不会打开新的窗口
        : target + " - " + dayjs().format("YYYY-MM-DD HH:mm:ss"),
      futures
    );

    return win;
  },
};
