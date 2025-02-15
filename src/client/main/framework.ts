import {
  app,
  BaseWindow,
  BrowserWindow,
  ipcMain,
  WebContentsView,
  screen,
} from "electron";

import themeMain from "src/client/channel/theme/main";
import routeMain from "src/client/channel/route/main";
import ThemeLocal from "src/client/local/theme-local/theme-local";
import windowMain from "src/client/channel/window/main";
import loginMain from "src/client/channel/login/main";
import localMain from "src/client/channel/local/main";
import filesMain from "src/client/channel/files/main";
import ElectronMain from "src/client/channel/electron/main";

import env from "src/client/env";
import Views from "src/client/main/views";
import UserLocal from "../local/user-local";
import devTool from "../env/dev-tool";

export default class Framework {
  /** 基础窗口 */
  baseWindow!: BaseWindow;
  /** framework view */
  frameworkView!: WebContentsView;
  /** 登录窗口 */
  loginWindow!: BrowserWindow;
  /** 菜单view */
  menuView?: WebContentsView;
  /** 当前应用打开的页面 */
  views: Views;
  /** 当前激活的path */
  path!: string;
  theme: ThemeLocal;
  userLocal: UserLocal;

  constructor() {
    this.theme = new ThemeLocal();
    this.userLocal = new UserLocal();
    this.views = new Views();
    this.createBaseWindow();
    this.createFramework();
    this.registerMain();
    this.createLogin();
  }

  private createBaseWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { workAreaSize } = primaryDisplay;
    this.baseWindow = new BaseWindow({
      height: workAreaSize.height - 100,
      width: workAreaSize.width - 100,
      minHeight: 800,
      minWidth: 1200,
      // icon: nativeImage.createFromPath(path.resolve(__dirname, Logo)),
      frame: true,
      titleBarStyle: "hidden",
      center: true,
      show: false,
    });
    this.baseWindow.setBackgroundColor(this.theme.backgroundColor);
  }

  createLogin() {
    this.loginWindow = new BrowserWindow({
      height: 600,
      width: 800,
      resizable: false,
      frame: true,
      titleBarStyle: "hidden",
      center: true,
      // icon: nativeImage.createFromPath(path.resolve(__dirname, Logo)),
      webPreferences: {
        preload: env.FRAMEWORK_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.loginWindow.setBackgroundColor(this.theme.backgroundColor);
    if (devTool.login) {
      this.loginWindow.webContents.openDevTools({ mode: "undocked" });
    }
    if (app.isPackaged) {
      this.loginWindow.webContents.loadURL(env.FRAMEWORK_WEBPACK_ENTRY);
      const listener = (event: Electron.IpcMainEvent) => {
        if (event.sender === this.loginWindow.webContents) {
          event.sender.send("onChangePath", "/login");
          ipcMain.removeListener("appMounted", listener);
        }
        event.returnValue = void 0;
      };
      ipcMain.on("appMounted", listener);
    } else {
      this.loginWindow.webContents.loadURL(
        `${env.FRAMEWORK_WEBPACK_ENTRY}/login`
      );
    }
  }

  private createFramework() {
    this.frameworkView = new WebContentsView({
      webPreferences: {
        preload: env.FRAMEWORK_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.frameworkView.setBackgroundColor(this.theme.backgroundColor);

    const { width, height } = this.baseWindow.getContentBounds();
    this.frameworkView.setBounds({ width, height, x: 0, y: 0 });
    if (devTool.framework) {
      this.frameworkView.webContents.openDevTools({ mode: "undocked" });
    }
  }

  private createMenuView() {
    this.menuView = new WebContentsView({
      webPreferences: {
        preload: env.FRAMEWORK_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.menuView.setBackgroundColor(this.theme.backgroundColor);
    this.menuView.setBounds(this.getContentSize());

    if (app.isPackaged) {
      this.menuView?.webContents.loadURL(env.FRAMEWORK_WEBPACK_ENTRY);
      const listener = (event: Electron.IpcMainEvent) => {
        if (event.sender === this.menuView?.webContents) {
          event.sender.send("onChangePath", "/menu");
          ipcMain.removeListener("appMounted", listener);
        }
        event.returnValue = void 0;
      };
      ipcMain.on("appMounted", listener);
    } else {
      this.menuView?.webContents.loadURL(`${env.FRAMEWORK_WEBPACK_ENTRY}/menu`);
    }

    if (devTool.menu) {
      this.menuView.webContents.openDevTools();
    }
  }

  /** 注册channel事件 */
  private registerMain() {
    themeMain({ framework: this });
    routeMain({ framework: this });
    windowMain({ framework: this });
    loginMain({ framework: this });
    localMain({ framework: this });
    filesMain({ framework: this });
    ElectronMain({ framework: this });
  }

  open(...arg: Parameters<RoutePreload["open"]>) {
    const [path] = arg;
    this.path = path;
    const view = this.views.open(...arg);
    this.views.hideAllView();
    view.view.setVisible(true);
    view.view.setBounds(this.getContentSize());
    this.baseWindow.contentView.addChildView(view.view);
    view.view.setBackgroundColor(this.theme.backgroundColor);
    if (devTool.page) {
      view.view.webContents.openDevTools({ mode: "right" });
    }
  }

  close(path: string) {
    const view = this.views.value.get(path)!;
    this.baseWindow.contentView.removeChildView(view.view);
    this.views.close(path);
  }

  /** 登录成功之后, */
  loginSuccess() {
    this.loginWindow.destroy();

    if (app.isPackaged) {
      this.frameworkView.webContents.loadURL(env.FRAMEWORK_WEBPACK_ENTRY);
      const listener = (event: Electron.IpcMainEvent) => {
        if (event.sender === this.frameworkView.webContents) {
          event.sender.send("onChangePath", "/layout");
          ipcMain.removeListener("appMounted", listener);
        }
        event.returnValue = void 0;
      };
      ipcMain.on("appMounted", listener);
    } else {
      this.frameworkView.webContents.loadURL(
        `${env.FRAMEWORK_WEBPACK_ENTRY}/layout`
      );
    }

    this.baseWindow.contentView.addChildView(this.frameworkView);
    this.baseWindow.show();
    this.open("/home", "首页");
  }

  /** 获取content区域的大小和位置 */
  getContentSize() {
    const { width, height } = this.baseWindow.getContentBounds();
    return { width, height: height - 30, x: 0, y: 30 };
  }

  /** 显示菜单窗口 */
  showMenu() {
    if (!this.menuView) {
      this.createMenuView();
    }
    this.baseWindow.contentView.addChildView(this.menuView!);
  }

  /** 隐藏菜单窗口 */
  hideMenu() {
    if (this.menuView) {
      this.baseWindow.contentView.removeChildView(this.menuView);
    }
  }
}
