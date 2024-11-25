import { autoUpdater, dialog } from "electron";

function showInstallModal() {
  dialog
    .showMessageBox({
      type: "question",
      title: "请安装最新版本的应用",
      buttons: ["立即安装", "稍后安装"],
      message:
        "安装新应用以获得最新的功能和完整的应用,您可以点击稍后安装保存你当前的工作数据,系统将会在2分钟提示您安装最新的应用。",
    })
    .then((res) => {
      if (res.response === 0) {
        autoUpdater.quitAndInstall();
      }
      if (res.response === 1) {
        setTimeout(() => {
          showInstallModal();
        }, 60 * 1000 * 2);
      }
    });
}

export default class Update {
  constructor() {
    autoUpdater.setFeedURL({
      url: "https://cdn.nowbenben.com/release/window/24-11-25",
    });

    autoUpdater.on("update-available", () => {
      dialog.showMessageBox({
        type: "info",
        title: "应用需要更新",
        message: "我们将在后台下载应用安装包",
      });
    });

    autoUpdater.on("update-downloaded", showInstallModal);
  }

  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }

  queryUpdate() {
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60 * 1000 * 60 * 10);
  }
}
