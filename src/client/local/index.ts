import { app } from "electron";
import fs from "fs";
import path from "path";

export default class Local<Store> {
  private static localPath = path.join(app.getPath("userData"), "custom-local");

  private static createLocalPath() {
    if (!fs.existsSync(Local.localPath)) {
      fs.mkdirSync(Local.localPath);
    }
  }

  constructor(localName: string, defaultValue: Store) {
    this.localName = localName;
    Local.createLocalPath();
    this.fileUrl = path.join(Local.localPath, `${localName}.txt`);
    if (fs.existsSync(this.fileUrl)) {
      const buffer = fs.readFileSync(this.fileUrl, { encoding: "utf-8" });
      try {
        this.store = JSON.parse(buffer);
      } catch (err) {
        this.store = defaultValue;
        this.syncToFile();
      }
    } else {
      this.store = defaultValue;
      this.syncToFile();
    }
  }

  localName: string;
  fileUrl: string;
  store: Store;

  syncToFile() {
    fs.writeFileSync(this.fileUrl, JSON.stringify(this.store), {
      encoding: "utf-8",
    });
  }
}
