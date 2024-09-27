import { WebContentsView } from "electron";
import env from "src/client/env";

export default class Views {
  value: Map<ViewsValue["path"], ViewsValue> = new Map();

  open(...arg: Parameters<RoutePreload["open"]>) {
    const [path, options] = arg;
    const host = env.app[options?.app!];
    const app = options?.app!;

    let fullPath = `${host.entry}/#${path}`;
    if (options?.query) {
      const params = new URLSearchParams(options.query);
      fullPath += params.toString();
    }

    const view = this.value.get(path);
    if (!view) {
      const newView = {
        path,
        app,
        query: options?.query,
        view: new WebContentsView({
          webPreferences: { preload: host.preload },
        }),
      };
      this.value.set(path, newView);
    }

    const returnView = this.value.get(path)!;
    returnView.query = options?.query;
    returnView.app = app;
    returnView.view.webContents.loadURL(fullPath);
    return returnView;
  }

  hideAllView() {
    this.value.forEach((view) => {
      view.view.setVisible(false);
    });
  }
}
