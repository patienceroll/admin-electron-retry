import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

import GlobalStyle from "./global-theme";

import Layout from "src/framework/layout";

export default function () {
  return (
    <ConfigProvider>
      <HashRouter>
        <Routes>
          <Route path="/layout" element={<Layout />} />
        </Routes>
      </HashRouter>
      <GlobalStyle />
    </ConfigProvider>
  );
}
