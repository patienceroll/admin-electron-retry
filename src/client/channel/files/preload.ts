import { ipcRenderer } from "electron";

export default function filesPreload(): FilesPreload {
  return {
    /** 预览网络资源url */
    previewFile(url) {
      return ipcRenderer.invoke("previewFile", url);
    },
    downloadFile(url) {
      return ipcRenderer.invoke("downloadFile", url);
    },
  };
}
