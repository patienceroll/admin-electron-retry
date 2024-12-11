import { ipcMain } from "electron";

import Framework from "src/client/main/framework";

export default function localMain(options: { framework: Framework }) {
  const { framework } = options;

  ipcMain.on("setLocalToken", function (event, token: string) {
    framework.userLocal.token = token;
    event.returnValue = void 0;
  });

  ipcMain.on("getLocalToken", function (event) {
    event.returnValue = framework.userLocal.token;
  });

  ipcMain.on("setLocalCompany", function (event, company: Company) {
    framework.userLocal.company = company;
    event.returnValue = void 0;
  });

  ipcMain.on("getLocalCompany", function (event) {
    event.returnValue = framework.userLocal.company;
  });

  ipcMain.on("setLocalUserMenu", function (event, menu) {
    framework.userLocal.menu = menu;
    event.returnValue = void 0;
  });

  ipcMain.on("getLocalUserMenu", function (event) {
    event.returnValue = framework.userLocal.menu;
  });

  ipcMain.on("getLocalUser", function (event) {
    event.returnValue = framework.userLocal.user;
  });

  ipcMain.on("setLocalUser", function (event, user) {
    framework.userLocal.user = user;
    event.returnValue = void 0;
  });

  ipcMain.on("getLocalUserPermission", function (event) {
    event.returnValue = framework.userLocal.permission;
  });

  ipcMain.on("getLocalUserHasPermission", function (event, path, slug) {
    const permission = framework.userLocal.permission || {};
    const slugs = permission[path];

    if (slug) {
      event.returnValue = slugs[slug];
    } else {
      event.returnValue = false;
    }
  });
}
