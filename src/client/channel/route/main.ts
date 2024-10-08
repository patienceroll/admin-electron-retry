import { ipcMain } from "electron";

import Framework from "src/client/main/framework";

export default function routeMain(options: { framework: Framework }) {
  const { framework } = options;

  function getCurrentRoutes(): GetRoutes {
    return {
      current: framework.path,
      routes: Array.from(framework.views.value.values()).map((item) => ({
        path: item.path,
        query: item.query,
        app: item.app,
        name: item.name,
      })),
    };
  }

  function onRoutesChange() {
    framework.frameworkView.webContents.send(
      "onRoutesChange",
      getCurrentRoutes()
    );
  }

  ipcMain.on(
    "open",
    function (_, path: string, options: Parameters<RoutePreload["open"]>[1]) {
      framework.open(path, options);
      onRoutesChange();
    }
  );

  ipcMain.on("getRoutes", function (event) {
    event.returnValue = getCurrentRoutes();
  });

  ipcMain.on("close", function (event, path: string) {
    framework.views.close(path);
    if (path === framework.path) {
      framework.views.hideAllView();
      const showView = framework.views.value.values().next().value!;
      framework.path = showView.path;
      showView.view.setVisible(true);
    }
    onRoutesChange()
  });
}
