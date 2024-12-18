// import env from "src/client/env";

import dayjs from "dayjs";

export default {
  /** 打开当前应用的某一个页面为窗口 */
  openCurrentAppWindow(...params: Parameters<typeof window.open>) {
    const [path, target = "_blank", futures] = params;
    const { origin, pathname, href } = location;

    let win: WindowProxy | null;
    const _target =
      target === "_blank"
        ? "_blank"
        : // 这里加个时间是因为同一个路由target存在的话会合并,并不会打开新的窗口
          target + " - " + dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (window.preload.isPackaged) {
      win = window.open(`${href}#${path}`, _target, futures);
    } else {
      const app = pathname.split("/").filter(Boolean)[0];

      win = window.open(`${origin}/${app}${path}`, _target, futures);
    }

    return win;
  },
};
