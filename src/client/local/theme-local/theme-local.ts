import { nativeTheme, systemPreferences } from "electron";

import Local from "..";

class ThemeLocal {
  private static get defaultTheme(): Theme {
    return {
      colorPrimary: systemPreferences.getAccentColor(),
      layout: "normal",
    };
  }

  constructor() {
    this._local = new Local(this.key, ThemeLocal.defaultTheme);
    this._local.store.colorPrimary = systemPreferences.getAccentColor()
    this._local.syncToFile();
  }

  private key = "theme";

  private _local: Local<Theme>;

  get value() {
    return this._local.store;
  }

  set value(value) {
    this._local.store = value;
    this._local.syncToFile();
  }

  get backgroundColor() {
    return nativeTheme.shouldUseDarkColors ? "#000" : "#fff";
  }
}

export default ThemeLocal;
