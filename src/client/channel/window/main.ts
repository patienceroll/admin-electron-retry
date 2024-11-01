import { app, ipcMain } from "electron";

import Framework from "src/client/main/framework";

export default function windowMain(options: { framework: Framework }) {
  const { framework } = options;

  framework.baseWindow.on("maximize", function () {
    framework.frameworkView.webContents.send("onMaximize");
  });

  framework.baseWindow.on("unmaximize", function () {
    framework.frameworkView.webContents.send("onUnmaximize");
  });

  framework.baseWindow.on("minimize", function () {
    framework.frameworkView.webContents.send("onMinimize");
  });

  framework.baseWindow.on("resize", function () {
    const { width, height } = framework.baseWindow.getContentBounds();
    framework.frameworkView.setBounds({ width, height, x: 0, y: 0 });
    Array.from(framework.views.value.values()).forEach((item) => {
      item.view.setBounds({
        width,
        height: height - 30,
        x: 0,
        y: 30,
      });
    });
  });

  ipcMain.on("isMaximize", function (event) {
    event.returnValue = framework.baseWindow.isMaximized();
  });

  ipcMain.on("maximize", function () {
    framework.baseWindow.maximize();
  });

  ipcMain.on("unmaximize", function () {
    framework.baseWindow.unmaximize();
  });

  ipcMain.on("minimize", function () {
    framework.baseWindow.minimize();
  });

  ipcMain.on("quit", function () {
    app.quit()
  });
}
