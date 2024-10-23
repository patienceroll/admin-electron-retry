import { ipcMain } from "electron";

import Framework from "src/client/main/framework";

export default function loginMain(options: { framework: Framework }) {
  const { framework } = options;
  ipcMain.on("loginSuccess", function (event, info: LoginSuccessInfo) {
    framework.userLocal.token = info.token;
    framework.loginSuccess();
  });
}
