import React, { useEffect, useState } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import locale from "antd/locale/zh_CN";

import Layout from "src/framework/layout";
import Login from "./login";
import Menu from "./menu";
import GlobalStyle from "src/framework/component/global-theme";
import ThemeProvider from "src/framework/component/theme-provider";

export default function () {
  const [themebase, setThemeBase] = useState(() => window.preload.getTheme());
  const [darkMode, setDarkMode] = useState(() => window.preload.darkMode);

  useEffect(() => {
    return window.preload.onDarkModeChange(setDarkMode);
  }, []);

  useEffect(() => {
    return window.preload.onThemeChange(setThemeBase);
  }, []);

  return (
    <ConfigProvider
    locale={locale}
      theme={{
        token: { colorPrimary: themebase.colorPrimary },
        algorithm: [
          darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          // theme.compactAlgorithm,
        ],
        components: {
          Segmented: {},
        },
      }}
    >
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/layout" element={<Layout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </HashRouter>
        <GlobalStyle />
      </ThemeProvider>
    </ConfigProvider>
  );
}
