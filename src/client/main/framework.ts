import { BaseWindow, nativeImage, nativeTheme, WebContentsView } from "electron";
import path from "path";

import Logo from "src/assets/logo/logo.png";
import themeMain from "src/client/channel/theme/main";
import ThemeLocal from "src/client/local/theme-local";

import env from "src/client/env";

export default class Framework {
  /** 基础窗口 */
  baseWindow!: BaseWindow;
  /** framework view */
  frameworkView!: WebContentsView;
  theme: ThemeLocal;

  constructor() {
    this.theme = new ThemeLocal()
    this.createBaseWindow();
    this.createFramework();
    this.registerMain();
  }

  private createBaseWindow() {
    this.baseWindow = new BaseWindow({
      height: 800,
      width: 1200,
      minHeight: 800,
      minWidth: 1200,
      icon: nativeImage.createFromPath(path.resolve(__dirname, Logo)),
      frame: true,
      titleBarStyle: "hidden",
      center: true,
    });
  }

  private createFramework() {
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


  private registerMain() {

    themeMain({ onNativeThemeUpdate() {
      
    } });
  }
}
