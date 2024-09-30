// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";

import themePreload from "src/client/channel/theme/preload";
import routePreload from "src/client/channel/route/preload";
import windowPredload from "src/client/channel/window/preload";

contextBridge.exposeInMainWorld(
  "preload",
  Object.assign(themePreload(), routePreload(), windowPredload())
);
