import { app, ipcMain } from "electron";
import Framework from "src/client/main/framework";

export default function (options: { framework: Framework }) {
  const { framework } = options;

  ipcMain.on("isPackaged", function (event) {
    event.returnValue = app.isPackaged;
  });
}
