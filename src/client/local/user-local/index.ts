import Local from "..";

export default class UserLocal {
  private static defaultConfig = { conmonlyMenu: [] };

  constructor() {
    this._local = new Local<LocalUserData>(this.key, UserLocal.defaultConfig);
    this._local.syncToFile();
  }

  private key = "user-local";

  private _local: Local<LocalUserData>;

  get token() {
    return this._local.store.token;
  }

  set token(token) {
    this._local.store.token = token;
    this._local.syncToFile();
  }

  /** 当前登录的公司信息 */
  get company() {
    return this._local.store.company;
  }

  set company(company) {
    this._local.store.company = company;
    this._local.syncToFile();
  }

  /** 当前用户信息 */
  get user() {
    return this._local.store.user;
  }

  set user(user) {
    this._local.store.user = user;
    this._local.syncToFile();
  }

  /** 当前用户的菜单 */
  get menu() {
    return this._local.store.menu;
  }

  set menu(menu) {
    this._local.store.menu = menu;
    const flatedMenu: UserMenu[] = [];

    function recusion(items: UserMenu[]) {
      items.forEach((item) => {
        flatedMenu.push(item);
        if (item.child instanceof Array) {
          recusion(item.child);
        }
      });
    }
    recusion(menu || []);

    // 根据菜单处理出权限数据,同时也比对菜单把常用菜单里面没有权限的菜单过滤掉
    this._local.store.permission = {};
    const newConmonlyMenu: ConmonlyMenu[] = [];
    flatedMenu.forEach((item) => {
      // 权限功能
      if (item.permission instanceof Array) {
        this._local.store.permission![item.path] = {};

        item.permission.forEach((per) => {
          this._local.store.permission![item.path][per.slug] = per.status === 1;
        });
      }
      // 通用菜单功能
      const menu = this.conmonlyMenu.find((menu) => item.id === menu.id);
      if (menu) {
        newConmonlyMenu.push(menu);
      }
    });
    this.conmonlyMenu = newConmonlyMenu;

    this._local.syncToFile();
  }

  /** 当前用户的常用菜单 */
  get conmonlyMenu() {
    return this._local.store.conmonlyMenu || [];
  }

  set conmonlyMenu(value) {
    this._local.store.conmonlyMenu = value;
    this._local.syncToFile();
  }

  /** 当前用户的权限 */
  get permission() {
    return this._local.store.permission;
  }

  reset() {
    this._local.store = UserLocal.defaultConfig;
  }
}
