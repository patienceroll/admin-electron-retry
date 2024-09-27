// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import themePreload from "src/client/channel/theme/preload";

contextBridge.exposeInMainWorld("preload", Object.assign({}, themePreload()));
