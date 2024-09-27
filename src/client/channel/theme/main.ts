import { ipcMain, nativeTheme } from "electron";

import Framework from "src/client/main/framework";

export default function themeMain(params: {
  onNativeThemeUpdate: VoidFunction;
  framework: Framework;
}) {
  const { onNativeThemeUpdate, framework } = params;
  nativeTheme.on("updated", onNativeThemeUpdate);

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
