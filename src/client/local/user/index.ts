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
}
