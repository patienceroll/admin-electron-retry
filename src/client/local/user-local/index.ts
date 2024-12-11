import Local from "..";

export default class UserLocal {
  constructor() {
    this._local = new Local<LocalUserData>(this.key, {});
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

  get company() {
    return this._local.store.company;
  }

  set company(company) {
    this._local.store.company = company;
    this._local.syncToFile();
  }

  get user() {
    return this._local.store.user;
  }

  set user(user) {
    this._local.store.user = user;
    this._local.syncToFile();
  }

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
    if (menu) {
      recusion(menu);
    }
    this._local.store.permission = {};

    flatedMenu.forEach((item) => {
      if (item.permission instanceof Array) {
        this._local.store.permission![item.path] = {};

        item.permission.forEach((per) => {
          this._local.store.permission![item.path][per.slug] = per.status === 1;
        });
      }
    });

    this._local.syncToFile();
  }

  get permission() {
    return this._local.store.permission;
  }
}
