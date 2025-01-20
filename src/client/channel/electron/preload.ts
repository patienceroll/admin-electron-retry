import { ipcRenderer } from "electron";

export default function electronPreload(): ElectronPreload {
  return {
    get isPackaged() {
      return ipcRenderer.sendSync("isPackaged");
    },
    
  };
}
