import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "./global-theme";

import Layout from "src/framework/layout";

export default function () {
  return (
    <ThemeProvider theme={{}}>
      <ConfigProvider>
        <HashRouter>
          <Routes>
            <Route path="/layout" element={<Layout />} />
          </Routes>
        </HashRouter>
        <GlobalStyle />
      </ConfigProvider>
    </ThemeProvider>
  );
}
