import { ipcMain, ipcRenderer } from "electron";

export default function routePreload(): RoutePreload {
  return {
    // 默认 apps admin
    open(path, options = {}) {
      ipcRenderer.send("open", path, Object.assign({ app: "admin" }, options));
    },
  };
}
