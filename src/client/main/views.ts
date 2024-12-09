import { BrowserWindow, nativeTheme, WebContentsView } from "electron";
import env from "src/client/env";
import devTool from "../env/dev-tool";

export default class Views {
  value: Map<ViewsValue["path"], ViewsValue> = new Map();

  open(...arg: Parameters<RoutePreload["open"]>) {
    const [path, name, options] = arg;
    const mergeOptions = Object.assign({ app: "admin" }, options);

    const host = env.app[mergeOptions!.app!];
    const app = mergeOptions!.app!;

    let fullPath = `${host.entry}#${path}`;
    if (mergeOptions?.query) {
      const params = new URLSearchParams(mergeOptions.query);
      fullPath += params.toString();
    }

    const view = this.value.get(path);
    if (!view) {
      const newView = {
        name,
        path,
        app,
        query: mergeOptions?.query,
        view: new WebContentsView({
          webPreferences: { preload: host.preload },
        }),
      };
      this.value.set(path, newView);
      newView.view.webContents.setWindowOpenHandler((options) => {
        return {
          action: "allow",
          createWindow(options) {
            const window = new BrowserWindow(options);
            window.setMenu(null);
            if (devTool.open) {
              window.webContents.openDevTools();
            }
            return window.webContents;
          },
          overrideBrowserWindowOptions: {
            height: 800,
            width: 1200,
            minHeight: 800,
            minWidth: 1200,
            title: options.frameName,
            autoHideMenuBar: true,
            titleBarStyle: "default",
            backgroundColor: nativeTheme.shouldUseDarkColors ? "#000" : "#fff",
            // alwaysOnTop: true,
            center: true,
            webPreferences: {
              preload: host.preload,
            },
          },
        };
      });
    }

    const returnView = this.value.get(path)!;
    returnView.query = mergeOptions?.query;
    returnView.app = app;
    returnView.view.webContents.loadURL(fullPath);
    return returnView;
  }

  /** 删除一个页面 */
  close(path: string) {
    this.value.delete(path);
  }

  hideAllView() {
    this.value.forEach((view) => {
      view.view.setVisible(false);
    });
  }

  /** 删除所有页面 */
  closeAll() {
    this.value.clear();
  }
}
