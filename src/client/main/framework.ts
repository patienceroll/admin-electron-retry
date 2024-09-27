import {
  BaseWindow,
  nativeImage,
  nativeTheme,
  WebContentsView,
} from "electron";
import path from "path";

import Logo from "src/assets/logo/logo.png";
import themeMain from "src/client/channel/theme/main";
import routeMain from "src/client/channel/route/main";
import ThemeLocal from "src/client/local/theme-local";

import env from "src/client/env";
import Views from "src/client/main/views";

export default class Framework {
  /** 基础窗口 */
  baseWindow!: BaseWindow;
  /** framework view */
  frameworkView!: WebContentsView;
  /** 当前应用打开的页面 */
  views: Views;
  /** 当前激活的path */
  path;
  theme: ThemeLocal;

  constructor() {
    this.theme = new ThemeLocal();
    this.createBaseWindow();
    this.createFramework();
    this.registerMain();
    this.views = new Views();
    this.path = "/home";
    this.views.open(this.path);
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
    this.baseWindow.setBackgroundColor(this.theme.backgroundColor);
  }

  private createFramework() {
    this.frameworkView = new WebContentsView({
      webPreferences: {
        preload: env.FRAMEWORK_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.frameworkView.setBackgroundColor(this.theme.backgroundColor);

    const { width, height } = this.baseWindow.getBounds();
    this.frameworkView.setBounds({ width, height, x: 0, y: 0 });

    this.frameworkView.webContents.loadURL(
      `${env.FRAMEWORK_WEBPACK_ENTRY}/#/layout`
    );

    this.baseWindow.contentView.addChildView(this.frameworkView);
  }

  private registerMain() {
    themeMain({ framework: this });
    routeMain({ framework: this });
  }

  open(...arg: Parameters<RoutePreload["open"]>) {
    const view = this.views.open(...arg);
    this.views.hideAllView();
    view.view.setVisible(true);
    const { width, height } = this.baseWindow.getBounds();
    view.view.setBounds({ width, height, x: 0, y: 0 });
  }
}
