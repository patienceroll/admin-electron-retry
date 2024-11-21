import { app, ipcMain, shell } from "electron";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

import Framework from "src/client/main/framework";

function get(url: string) {
  return new Promise<http.IncomingMessage>((resolve, reject) => {
    https.get(url, function (response) {
      if (response.statusCode === 200) {
        resolve(response);
      }
      reject(response);
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

  ipcMain.handle("viewImage", async function (event, url: string) {
    const suffix = url.split(".").pop()!;
    const tempPath = path.resolve(
      app.getPath("temp"),
      `image-view-temp.${suffix}`
    );

    const response = await get(url);
    if (response.statusCode !== 200) {
      throw new Error(`下载失败，状态码：${response.statusCode}`);
    }

    const fileStream = fs.createWriteStream(tempPath);
    response.pipe(fileStream);
    // 等待文件流完成
    await promisifyStream(fileStream);
    await shell.openPath(tempPath);
  });
}
