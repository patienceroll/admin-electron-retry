import { app, dialog, ipcMain, Notification, shell } from "electron";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

import Framework from "src/client/main/framework";
import { formatFileSize, parseUrlFile } from "src/util/file/parse";

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

function head(url: string) {
  return new Promise<http.IncomingMessage>((resolve, reject) => {
    https.get(url, { method: "HEAD" }, function (response) {
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
      const tempPath = path.resolve(app.getPath("temp"), app.getName());
      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath);
      }
      const tempFileName = path.resolve(tempPath, `${filename}`);
      if (fs.existsSync(tempFileName)) {
        await shell.openPath(tempFileName);
      } else {
        const headResponse = await head(url);
        const contentLength = headResponse.headers["content-length"];
        if (contentLength) {
          if (Number(contentLength) > 2 * 1024 * 1024) {
            const size = formatFileSize(Number(contentLength));
            new Notification({
              title: "正在下载预览文件",
              body: `当前文件大小${size},预览速度可能较慢,请稍等。`,
            }).show();
          }
        }
        const response = await get(url);
        const fileStream = fs.createWriteStream(tempFileName);
        response.pipe(fileStream);
        // 等待文件流完成
        await promisifyStream(fileStream);
        await shell.openPath(tempFileName);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  });

  ipcMain.handle("downloadFile", async function (event, url: string) {
    try {
      const { filename, extension } = parseUrlFile(url);

      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "保存文件",
        defaultPath: decodeURIComponent(filename),
        properties: ["createDirectory"],
      });

      if (canceled) return Promise.resolve();

      const tempPath = path.resolve(app.getPath("temp"), app.getName());
      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath);
      }

      const headResponse = await head(url);
      const contentLength = headResponse.headers["content-length"];
      if (contentLength) {
        if (Number(contentLength) > 2 * 1024 * 1024) {
          const size = formatFileSize(Number(contentLength));
          new Notification({
            title: "正在下载预览文件",
            body: `当前文件大小${size},预览速度可能较慢,请稍等。`,
          }).show();
        }
      }
      const response = await get(url);
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      // 等待文件流完成
      await promisifyStream(fileStream);
    } catch (err: any) {
      throw new Error(err.message);
    }
  });
}
