import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import path from "path";

import buildCSP from "./src/client/csp-policy";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const devContentSecurityPolicy = buildCSP({
  defaultSrc: ["'self'"],
  connectSrc: [
    "'self'",
    "http://118.89.67.217:9638",
    "*.qiniu.com",
    "*.amap.com",
  ],
  fontSrc: ["'self'", "data:"],
  imgSrc: ["*", "data:", "blob:"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  workerSrc: ["'self'", "blob:"],
  scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "*.amap.com"],
});
const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: "DOMS",
    icon: path.resolve(__dirname, "./src/assets/logo/logo"),
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      usePackageJson: false,
      authors: "zxl",
      name: "DOMS",
      description: "DOMS",
      version: "1.0.0",
      // exe: "DOMS",
      setupExe: "DOMS-install.exe",
      // 生成的 Setup.exe 的图标文件路径
      setupIcon: path.resolve(__dirname, "./src/assets/logo/logo.ico"),
      // 应用程序图标的 URL（显示在“控制面板”>“程序和功能”中）
      // iconUrl: "https://www.electronjs.org/zh/assets/img/favicon.ico",
    }),
    // new MakerZIP({}, ["darwin"]),
    // new MakerRpm({}),
    // new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/framework/index.html",
            js: "./src/framework/index.ts",
            name: "framework",
            preload: {
              js: "./src/client/preload/index.ts",
            },
          },
          {
            html: "./src/apps/admin/index.html",
            js: "./src/apps/admin/index.tsx",
            name: "admin",
            preload: {
              js: "./src/client/preload/index.ts",
            },
          },
        ],
      },
      port: 3001,
      devContentSecurityPolicy,
      devServer: {
        client: {
          overlay: {
            errors: true,
            runtimeErrors: false,
            warnings: true,
          },
        },
        proxy: {
          "/framework/*": {
            target: "http://localhost:3001",
            changeOrigin: true,
            pathRewrite: () => "/framework",
          },
          "/admin/*": {
            target: "http://localhost:3001",
            changeOrigin: true,
            pathRewrite: () => "/admin",
          },
        },
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
