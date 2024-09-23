import { app } from "electron";
import fs from "fs";
import path from "path";

export default class LocalSave {
  constructor(storeName: string) {
    this.storeName = storeName;
    this.fileUrl = path.join(app.getPath("userData"), `${storeName}.txt`);

    if (fs.existsSync(this.fileUrl)) {
      const buffer = fs.readFileSync(this.fileUrl, { encoding: "utf-8" });
      try {
        this.store = JSON.parse(buffer);
      } catch (err) {
        this.store = {};
        this.syncToFile();
      }
    } else {
      this.store = {};
      this.syncToFile();
    }
  }

  storeName: string;
  fileUrl: string;
  store: Record<string, unknown>;

  private syncToFile() {
    fs.writeFileSync(this.fileUrl, JSON.stringify(this.store), {
      encoding: "utf-8",
    });
  }

  setItem(key: string, value: unknown) {
    this.store[key] = value;
    this.syncToFile();
  }

  getItem<T>(key: string) {
    return this.store[key] as T | undefined;
  }
}
