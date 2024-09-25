import { nativeTheme } from "electron";
import Local from ".";

class ThemeLocal {
  private static get defaultTheme(): Theme {
    return {
      colorPrimary: "#f40",
      dark: nativeTheme.shouldUseDarkColors,
    };
  }

  constructor() {
    this._local = new Local(this.key, ThemeLocal.defaultTheme);
    this._local.store.dark = nativeTheme.shouldUseDarkColors;
    this._local.syncToFile();
    nativeTheme.themeSource = this._local.store.dark ? 'dark':'light';
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
}

export default  ThemeLocal;
