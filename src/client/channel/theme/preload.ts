import { ipcRenderer, nativeTheme } from "electron";

export default function themePreload(): ThemePreload {
  return {
    getTheme() {
      return ipcRenderer.sendSync("getTheme");
    },
    setTheme(theme) {
      return ipcRenderer.sendSync("setTheme", theme);
    },
    get darkMode() {
      return ipcRenderer.sendSync("darkMode");
    },
    onDarkModeChange(callback) {
      function listener(_: Electron.IpcRendererEvent, dark: boolean) {
        callback(dark);
      }
      ipcRenderer.on("onDarkModeChange", listener);
      return function () {
        ipcRenderer.removeListener("onDarkModeChange", listener);
      };
    },
    onThemeChange(callback) {
      function listener(_: Electron.IpcRendererEvent, theme: Theme) {
        callback(theme);
      }
      ipcRenderer.on("onThemeChange", listener);
      return function () {
        ipcRenderer.removeListener("onThemeChange", listener);
      };
    },
  };
}
