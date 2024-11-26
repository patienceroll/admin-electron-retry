import { app, ipcMain, shell } from "electron";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

import Framework from "src/client/main/framework";
import { parseUrlFile } from "src/util/file/parse";

function get(url: string) {
  return new Promise<http.IncomingMessage>((resolve, reject) => {
    https.get(url, function (response) {
      if (response.statusCode === 200) {
        resolve(response);
      }
      reject(new Error(`${response.statusCode} ${response.statusMessage}`));
    });
  });
}

function promisifyStream(stream: fs.WriteStream) {
  return new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

export default function filesMain(options: { framework: Framework }) {
  const { framework } = options;

  ipcMain.handle("previewFile", async function (event, url: string) {
    try {
      const { filename, extension } = parseUrlFile(url);
      const tempPath = path.resolve(
        app.getPath("temp"),
        `${filename}.${extension}`
      );
      const response = await get(url);
      const fileStream = fs.createWriteStream(tempPath);
      response.pipe(fileStream);
      // 等待文件流完成
      await promisifyStream(fileStream);
      await shell.openPath(tempPath);
    } catch (err: any) {
      throw new Error(err.message);
    }
  });
}
