import { ipcRenderer } from "electron";

export default function localPreload(): LocalPreload {
  return {
    getLocalToken() {
      return ipcRenderer.sendSync("getLocalToken");
    },
    setLocalToken(token) {
      return ipcRenderer.sendSync("setLocalToken", token);
    },
    setLocalCompany(company: Company) {
      return ipcRenderer.sendSync("setLocalCompany", company);
    },
    getLocalCompany() {
      return ipcRenderer.sendSync("getLocalCompany");
    },
    setLocalUserMenu(menu) {
      return ipcRenderer.sendSync("setLocalUserMenu", menu);
    },
    getLocalUserMenu() {
      return ipcRenderer.sendSync("getLocalUserMenu");
    },
    getLocalUser() {
      return ipcRenderer.sendSync("getLocalUser");
    },
    setLocalUser(menu) {
      return ipcRenderer.sendSync("setLocalUser", menu);
    },
    getLocalUserPermission() {
      return ipcRenderer.sendSync("getLocalUserPermission");
    },
    getLocalUserHasPermission(path, slug) {
      return ipcRenderer.sendSync("getLocalUserHasPermission", path, slug);
    },
  };
}
