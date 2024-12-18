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
    showMenu() {
      return ipcRenderer.sendSync("showMenu");
    },
    hideMenu() {
      return ipcRenderer.sendSync("hideMenu");
    },
    isMenuShowed() {
      return ipcRenderer.sendSync("isMenuShowed");
    },
    switchPage(path) {
      return ipcRenderer.sendSync("switchPage", path);
    },
    appMounted() {
      return ipcRenderer.sendSync("appMounted");
    },
    onChangePath(callback) {
      function listener(_: Electron.IpcRendererEvent, path: string) {
        callback(path);
      }
      ipcRenderer.on("onChangePath", listener);
      return function () {
        ipcRenderer.removeListener("onChangePath", listener);
      };
    },
  };
}
