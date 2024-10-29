import { ipcMain } from "electron";

import Framework from "src/client/main/framework";

export default function loginMain(options: { framework: Framework }) {
  const { framework } = options;
  ipcMain.on("loginSuccess", function (event, info: LoginSuccessInfo) {
    framework.userLocal.token = info.token;
    framework.loginSuccess();
  });
  ipcMain.on("login", function (event) {
    framework.views.value.forEach((item) => {
      framework.baseWindow.contentView.removeChildView(item.view);
    });
    framework.views.closeAll();
    framework.createLogin()
    framework.baseWindow.hide()
  });
}
