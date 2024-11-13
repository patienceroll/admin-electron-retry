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
    this._local.syncToFile();
  }
}
