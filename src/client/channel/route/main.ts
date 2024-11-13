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
    const current = getCurrentRoutes();
    framework.frameworkView.webContents.send("onRoutesChange", current);
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
    framework.close(path);
    if (path === framework.path) {
      framework.views.hideAllView();
      const showView = framework.views.value.values().next().value!;
      framework.path = showView.path;
      showView.view.setVisible(true);
    }
    onRoutesChange();
  });

  ipcMain.on("showMenu", function (event) {
    framework.showMenu();
    event.returnValue = void 0;
  });

  ipcMain.on("hideMenu", function (event) {
    framework.hideMenu();
    event.returnValue = void 0;
  });

  ipcMain.on("isMenuShowed", function (event) {
    event.returnValue = framework.menuView
      ? framework.baseWindow.contentView.children.includes(framework.menuView)
      : false;
  });

  ipcMain.on("switchPage", function (event, path: string) {
    const item = framework.views.value.get(path);
    if (item) {
      framework.views.hideAllView();
      item.view.setVisible(true);
      item.view.setBounds(framework.getContentSize());
      framework.baseWindow.contentView.addChildView(item.view);
      item.view.setBackgroundColor(framework.theme.backgroundColor);
      framework.path = path
      onRoutesChange()
    }
    event.returnValue = void 0;
  });
}
