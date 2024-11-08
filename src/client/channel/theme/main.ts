import { ipcMain, nativeTheme, systemPreferences } from "electron";

import Framework from "src/client/main/framework";

export default function themeMain(params: { framework: Framework }) {
  const { framework } = params;
  nativeTheme.on("updated", function () {
    framework.baseWindow.setBackgroundColor(framework.theme.backgroundColor);
    framework.frameworkView.setBackgroundColor(framework.theme.backgroundColor);
    framework.menuView?.setBackgroundColor(framework.theme.backgroundColor);
    if (!framework.loginWindow.isDestroyed()) {
      framework.loginWindow.setBackgroundColor(framework.theme.backgroundColor);
      framework.loginWindow.webContents.send(
        "onDarkModeChange",
        nativeTheme.shouldUseDarkColors
      );
    }

    framework.frameworkView.webContents.send(
      "onDarkModeChange",
      nativeTheme.shouldUseDarkColors
    );

    framework.menuView?.webContents.send(
      "onDarkModeChange",
      nativeTheme.shouldUseDarkColors
    );

    framework.views.value.forEach((view) => {
      view.view.webContents.send(
        "onDarkModeChange",
        nativeTheme.shouldUseDarkColors
      );
    });
  });

  systemPreferences.on("accent-color-changed", function () {
    const value = Object.assign(framework.theme.value, {
      colorPrimary: systemPreferences.getAccentColor(),
    });
    framework.frameworkView.webContents.send("onThemeChange", value);
    framework.menuView?.webContents.send("onThemeChange", value);
    framework.views.value.forEach((view) => {
      view.view.webContents.send("onThemeChange", value);
    });
    if (!framework.loginWindow.isDestroyed()) {
      framework.loginWindow.webContents.send("onThemeChange", value);
    }
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
