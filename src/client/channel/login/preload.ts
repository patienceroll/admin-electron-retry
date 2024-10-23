import { ipcRenderer } from "electron";

export default function loginPreload(): LoginPreload {
  return {
    loginSuccess(info) {
      ipcRenderer.send("loginSuccess", info);
    },
  };
}
