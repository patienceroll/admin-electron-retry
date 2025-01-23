import type { WebpackConfiguration } from "@electron-forge/plugin-webpack/dist/Config";
import path from "path";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});
rules.push({
  test: /\.svg$/,
  use: ["@svgr/webpack"],
});

export const rendererConfig: WebpackConfiguration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
