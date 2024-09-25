import { app } from "electron";
import fs from "fs";
import path from "path";

export default class Local<Store> {
  constructor(localName: string, defaultValue: Store) {
    this.localName = localName;
    this.fileUrl = path.join(app.getPath("userData"), `${localName}.txt`);
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
