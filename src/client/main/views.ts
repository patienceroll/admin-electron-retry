import {
  BrowserWindow,
  ipcMain,
  nativeTheme,
  WebContentsView,
  app as electronApp,
} from "electron";
import env from "src/client/env";
import devTool from "../env/dev-tool";

function getProtocolType(url: string) {
  // 正则表达式匹配URL的协议部分
  const protocolRegex = /^(\w+):\/\//;
  const match = url.match(protocolRegex);
  if (match) return match[1];
  return null;
}

export default class Views {
  value: Map<ViewsValue["path"], ViewsValue> = new Map();

  private windowOpenHandler(
    details: Electron.HandlerDetails,
    preload: string
  ): Electron.WindowOpenHandlerResponse {
    return {
      action: "allow",
      createWindow(options: Electron.BaseWindowConstructorOptions) {
        const window = new BrowserWindow(options);

        const isFileProtocol = getProtocolType(details.url) === "file";
        if (isFileProtocol) {
          const [url, path] = details.url.split("#");
          window.loadURL(url);
          const listener = (event: Electron.IpcMainEvent) => {
            if (event.sender === window.webContents) {
              event.sender.send("onChangePath", path);
              ipcMain.removeListener("appMounted", listener);
            }
            event.returnValue = void 0;
          };
          ipcMain.on("appMounted", listener);
        }

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
        title: details.frameName,
        autoHideMenuBar: true,
        titleBarStyle: "default",
        backgroundColor: nativeTheme.shouldUseDarkColors ? "#000" : "#fff",
        // alwaysOnTop: true,
        center: true,
        webPreferences: {
          preload: preload,
        },
      },
    };
  }

  open(...arg: Parameters<RoutePreload["open"]>) {
    const [path, name, options] = arg;
    const mergeOptions = Object.assign<
      NonNullable<typeof options>,
      NonNullable<typeof options>
    >({ app: "admin" }, options || {});

    const host = env.app[mergeOptions!.app!];
    const app = mergeOptions!.app!;

    let fullPath = path;
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
      newView.view.webContents.setWindowOpenHandler((detail) =>
        this.windowOpenHandler(detail, host.preload)
      );
    }

    const returnView = this.value.get(path)!;
    returnView.query = mergeOptions?.query;
    returnView.app = app;

    if (electronApp.isPackaged) {
      returnView.view.webContents.loadURL(host.entry);

      const listener = (event: Electron.IpcMainEvent) => {
        if (event.sender === returnView.view.webContents) {
          event.sender.send("onChangePath", fullPath);
          ipcMain.removeListener("appMounted", listener);
        }
        event.returnValue = void 0;
      };
      ipcMain.on("appMounted", listener);
    } else {
      returnView.view.webContents.loadURL(host.entry + fullPath);
    }

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
