import { ipcMain } from "electron";

import Framework from "src/client/main/framework";

export default function routeMain(options: { framework: Framework }) {
  const { framework } = options;
  ipcMain.on(
    "open",
    function (_, path: string, options: Parameters<RoutePreload["open"]>[1]) {
      framework.open(path, options);
    }
  );

  ipcMain.on("getRoutes", function (event) {
    const returnValue: ReturnType<RoutePreload["getRoutes"]> = {
      current: framework.path,
      routes: Array.from(framework.views.value.values()).map((item) => ({
        path: item.path,
        query: item.query,
        app: item.app,
        name: item.name,
      })),
    };
    event.returnValue = returnValue;
  });
}
