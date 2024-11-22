import { ipcRenderer } from "electron";

export default function filesPreload(): FilesPreload {
  return {
    viewImage(url) {
      return ipcRenderer.invoke("viewImage", url);
    },
  };
}
