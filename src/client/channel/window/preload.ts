import { ipcRenderer } from "electron";

export default function windowPreload(): WindowPreload {
  return {
    onMaximize(callback) {
      ipcRenderer.on("onMaximize", callback);
      return function () {
        ipcRenderer.removeListener("onMaximize", callback);
      };
    },
    onMinimize(callback) {
      ipcRenderer.on("onMinimize", callback);
      return function () {
        ipcRenderer.removeListener("onMinimize", callback);
      };
    },
    onUnmaximize(callback) {
      ipcRenderer.on("onUnmaximize", callback);
      return function () {
        ipcRenderer.removeListener("onUnmaximize", callback);
      };
    },
    isMaximize() {
      return ipcRenderer.sendSync("isMaximize");
    },
    maximize() {
      ipcRenderer.send("maximize");
    },
    minimize() {
      ipcRenderer.send("minimize");
    },
    unmaximize() {
      ipcRenderer.send("unmaximize");
    },
    close() {
      ipcRenderer.send('close')
    }
  };
}
