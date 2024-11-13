import React, { useEffect, useState } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";

import GlobalStyle from "src/framework/component/global-theme";
import ThemeProvider from "src/framework/component/theme-provider";

import Home from "./pages/home";
import UserInfo from "./pages/user-info";
import OrganizationCompany from "./pages/organization/company";

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
      theme={{
        token: { colorPrimary: themebase.colorPrimary },
        algorithm: [
          darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          theme.compactAlgorithm,
        ],
      }}
    >
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/home" Component={Home} />
            <Route path="/user-info" Component={UserInfo} />
            <Route
              path="/organization/company"
              Component={OrganizationCompany}
            />
          </Routes>
        </HashRouter>
        <GlobalStyle />
      </ThemeProvider>
    </ConfigProvider>
  );
}
