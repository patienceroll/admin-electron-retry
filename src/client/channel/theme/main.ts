import { ipcMain, nativeTheme } from "electron";

import Framework from "src/client/main/framework";

export default function themeMain(params: {
  framework: Framework;
}) {
  const {  framework } = params;
  nativeTheme.on("updated", function() {
    framework.baseWindow.setBackgroundColor(
      framework.theme.backgroundColor
    );
    framework.frameworkView.setBackgroundColor(
      framework.theme.backgroundColor
    );
    framework.frameworkView.webContents.send(
      "onDarkModeChange",
      nativeTheme.shouldUseDarkColors
    );
  });

  ipcMain.on("getTheme", function (event) {
    event.returnValue = framework.theme.value;
  });

  ipcMain.on("setTheme", function (event, theme: Partial<Theme>) {
    framework.theme.value = Object.assign(framework.theme.value, theme);
    event.returnValue = void 0;
  });

  ipcMain.on("darkMode", function (event) {
    event.returnValue = nativeTheme.shouldUseDarkColors;
  });

  
}
