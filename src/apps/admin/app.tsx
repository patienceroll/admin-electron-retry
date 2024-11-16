import React, { useEffect, useState } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { ConfigProvider, Modal, notification, theme, ThemeConfig } from "antd";
import { ProConfigProvider } from "@ant-design/pro-components";
import locale from "antd/locale/zh_CN";

import GlobalStyle from "src/framework/component/global-theme";
import ThemeProvider from "src/framework/component/theme-provider";
import ProgressBar from "src/framework/component/progress-bar";

import Home from "./pages/home";
import UserInfo from "./pages/user-info";
import OrganizationCompany from "./pages/organization/company";
import OrganizationDepartment from "./pages/organization/department";

import contextedNotify from "src/framework/component/contexted-notify";
import contextedModal from "src/framework/component/contexted-modal";

export default function () {
  const [themebase, setThemeBase] = useState(() => window.preload.getTheme());
  const [darkMode, setDarkMode] = useState(() => window.preload.darkMode);

  const [api, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();

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
    contextedModal.modal = modalApi;
  }, [modalApi]);

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
          Segmented: {},
          Input: {},
          Button: {
            textTextColor: designToken.colorPrimary,
            textTextHoverColor: designToken.colorPrimaryTextHover,
            textTextActiveColor: designToken.colorPrimaryTextActive,
            textHoverBg: designToken.colorPrimaryBg,
            colorBgTextActive: designToken.colorPrimaryBgHover,
          },
          Card: {},
        },
      })}
    >
      <ProConfigProvider token={{}}>
        <ThemeProvider>
          <ProgressBar />
          {contextHolder}
          {modalContextHolder}
          <HashRouter>
            <Routes>
              <Route path="/home" Component={Home} />
              <Route path="/user-info" Component={UserInfo} />
              <Route
                path="/organization/company"
                Component={OrganizationCompany}
              />
              <Route
                path="/organization/department"
                Component={OrganizationDepartment}
              />
            </Routes>
          </HashRouter>
          <GlobalStyle />
        </ThemeProvider>
      </ProConfigProvider>
    </ConfigProvider>
  );
}
