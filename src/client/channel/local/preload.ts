import { ipcRenderer } from "electron";

export default function localPreload(): LocalPreload {
  return {
    getLocalToken() {
      return ipcRenderer.sendSync("getLocalToken");
    },
    setLocalToken(token) {
      return ipcRenderer.sendSync("setLocalToken", token);
    },
  };
}
