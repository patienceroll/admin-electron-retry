import { ipcMain, nativeTheme } from "electron";

export default function themeMain(params: {
  onNativeThemeUpdate: VoidFunction;
}) {
  const { onNativeThemeUpdate } = params;
  nativeTheme.on("updated", onNativeThemeUpdate);
}
