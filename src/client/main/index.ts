import { app, BrowserWindow, session } from "electron";

import Framework from "src/client/main/framework";

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
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-eval' 'unsafe-inline' ; connect-src 'self' http://118.89.67.217:9638;font-src 'self' data: ; img-src 'self' data:",
        ],
      },
    });
  });
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
