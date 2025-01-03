import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
    typescript: {
      configFile: path.resolve(__dirname, "tsconfig.json"), // 指定 TypeScript 配置文件
      diagnosticOptions: {
        semantic: false, // 启用语义检查
        syntactic: false, // 启用语法检查
        declaration: false, // 控制是否检查声明文件（.d.ts）中的错误。
        global: false, // 控制是否检查全局范围内的错误。
      },
    },
  }),
];
