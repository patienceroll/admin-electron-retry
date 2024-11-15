import React, { useEffect, useState } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { ConfigProvider, notification, theme, ThemeConfig } from "antd";
import locale from "antd/locale/zh_CN";

import Layout from "src/framework/layout";
import Login from "./login";
import Menu from "./menu";
import GlobalStyle from "src/framework/component/global-theme";
import ThemeProvider from "src/framework/component/theme-provider";
import ProgressBar from "src/framework/component/progress-bar";

import contextedNotify from "src/util/contexted-notify";

export default function () {
  const [themebase, setThemeBase] = useState(() => window.preload.getTheme());
  const [darkMode, setDarkMode] = useState(() => window.preload.darkMode);
  const [api, contextHolder] = notification.useNotification();

  const themeDefault: ThemeConfig = {
    token: { colorPrimary: themebase.colorPrimary },
    algorithm: [
      darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      // theme.compactAlgorithm,
    ],
  };
  const designToken = theme.getDesignToken(themeDefault);

  useEffect(() => {
    contextedNotify.notification = api;
  }, [api]);

  useEffect(() => {
    return window.preload.onDarkModeChange(setDarkMode);
  }, []);

  useEffect(() => {
    return window.preload.onThemeChange(setThemeBase);
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={Object.assign<ThemeConfig, ThemeConfig>(themeDefault, {
        components: {
          Segmented: {
            itemSelectedBg: designToken.colorPrimary,
            itemSelectedColor: designToken.colorBgBase,
          },
        },
      })}
    >
      <ThemeProvider>
        <ProgressBar />
        {contextHolder}
        <HashRouter>
          <Routes>
            <Route path="/layout" element={<Layout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={<Menu darkMode={darkMode} />} />
          </Routes>
        </HashRouter>
        <GlobalStyle />
      </ThemeProvider>
    </ConfigProvider>
  );
}
