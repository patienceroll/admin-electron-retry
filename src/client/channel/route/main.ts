import { ipcMain } from "electron";

import Framework from "src/client/main/framework";

export default function routeMain(options: { framework: Framework }) {
  const { framework } = options;
  ipcMain.on(
    "open",
    function (
      event,
      path: string,
      options: Parameters<RoutePreload["open"]>[1]
    ) {
      framework.open(path, options);
    }
  );
}
