import { ipcRenderer } from "electron";

export default function routePreload(): RoutePreload {
  return {
    // 默认 apps admin
    open(path, name, options) {
      ipcRenderer.send("open", path, name, options);
    },
    close(path) {
      ipcRenderer.send("close", path);
    },
    getRoutes() {
      return ipcRenderer.sendSync("getRoutes");
    },
    onRoutesChange(callback) {
      function listener(_: Electron.IpcRendererEvent, routes: GetRoutes) {
        callback(routes);
      }
      ipcRenderer.on("onRoutesChange", listener);
      return function () {
        ipcRenderer.removeListener("onRoutesChange", listener);
      };
    },
  };
}
