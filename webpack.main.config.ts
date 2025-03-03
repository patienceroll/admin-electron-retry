import type { WebpackConfiguration } from "@electron-forge/plugin-webpack/dist/Config";
import path from "path";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

export const mainConfig: WebpackConfiguration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/client/main/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
