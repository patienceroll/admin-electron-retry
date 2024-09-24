import { BaseWindow, WebContentsView } from "electron";

import env from "src/client/env";

export default class Framework {
  /** 基础窗口 */
  baseWindow: BaseWindow;

  /** framework view */
  frameworkView: WebContentsView;

  constructor() {
    this.baseWindow = new BaseWindow({
      height: 800,
      width: 1200,
      minHeight: 800,
      minWidth: 1200,
      //   icon: nativeImage.createFromPath(path.resolve(__dirname, logo)),
      frame: true,
      titleBarStyle: "hidden",
      center: true,
    });

    this.frameworkView = new WebContentsView({
      webPreferences: {
        preload: env.FRAMEWORK_PRELOAD_WEBPACK_ENTRY,
      },
    });

    const { width, height } = this.baseWindow.getBounds();
    this.frameworkView.setBounds({ width, height, x: 0, y: 0 });

    this.frameworkView.webContents.loadURL(
      `${env.FRAMEWORK_WEBPACK_ENTRY}/#/layout`
    );

    this.baseWindow.contentView.addChildView(this.frameworkView);
    this.frameworkView.webContents.openDevTools();
  }
}
