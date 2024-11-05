import { ipcRenderer } from "electron";

export default function loginPreload(): LoginPreload {
  return {
    loginSuccess() {
      ipcRenderer.send("loginSuccess");
    },
    login() {
      ipcRenderer.send("login");
    },
  };
}
