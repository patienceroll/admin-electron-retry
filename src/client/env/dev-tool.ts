import { app } from "electron";

const config = {
  // 展示 titlebar 的开发者工具
  frame: false,
  // 展示登录页面的开发者工具
  login: true,
  // 展示菜单页面的开发者工具
  menu: true,
  // 展示有tab页面的开发者工具
  page: true,
  // 展示通过 window.open 打开的页面的开发者工具
  open: true,
};

export default {
  get framework() {
    return !app.isPackaged && config["frame"];
  },
  get login() {
    return !app.isPackaged && config["login"];
  },
  get menu() {
    return !app.isPackaged && config["menu"];
  },
  get page() {
    return !app.isPackaged && config["page"];
  },
  get open() {
    return !app.isPackaged && config["open"];
  },
};
