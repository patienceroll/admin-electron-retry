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
}
