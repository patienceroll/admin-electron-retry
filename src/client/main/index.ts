import { app, BrowserWindow, session } from "electron";

import Framework from "src/client/main/framework";
import Update from "../update";

let framework: Framework;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", function () {
    if (framework) {
      if (framework.loginWindow.isDestroyed()) {
        framework.baseWindow.focus();
      } else {
        framework.loginWindow.focus();
      }
    }
  });
}

function createWindow() {
  if (app.isPackaged) {
    new Update().queryUpdate();
  }
  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   debugger;
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       "Content-Security-Policy": [
  //         buildCSP({
  //           defaultSrc: ["'self'"],
  //           connectSrc: [
  //             "'self'",
  //             "http://118.89.67.217:9638",
  //             "*.qiniu.com",
  //             "*.amap.com",
  //           ],
  //           fontSrc: ["'self'", "data:"],
  //           imgSrc: ["*", "data:", "blob:"],
  //           styleSrc: ["'self'", "'unsafe-inline'"],
  //           workerSrc: ["'self'", "blob:"],
  //           scriptSrc: app.isPackaged
  //             ? ["'self'"]
  //             : ["'self'", "'unsafe-eval'", "'unsafe-inline'", "*.amap.com"],
  //         }),
  //       ],
  //     },
  //   });
  // });
  framework = new Framework();
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
