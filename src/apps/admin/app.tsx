import React, { useEffect, useState } from "react";
import {
  ConfigProvider,
  message,
  Modal,
  notification,
  theme,
  ThemeConfig,
} from "antd";
import { ProConfigProvider } from "@ant-design/pro-components";
import locale from "antd/locale/zh_CN";

import GlobalStyle from "src/framework/component/global-theme";
import ThemeProvider from "src/framework/component/theme-provider";
import ProgressBar from "src/framework/component/progress-bar";

import contextedNotify from "src/framework/component/contexted-notify";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";

import Routes from "./routes";

export default function () {
  const [themebase, setThemeBase] = useState(() => window.preload.getTheme());
  const [darkMode, setDarkMode] = useState(() => window.preload.darkMode);

  const [api, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const algorithm = [darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm];

  if (themebase.layout === "compact") {
    algorithm.push(theme.compactAlgorithm);
  }

  const themeDefault: ThemeConfig = {
    token: { colorPrimary: themebase.colorPrimary },
    algorithm,
  };

  const designToken = theme.getDesignToken(themeDefault);

  useEffect(() => {
    contextedNotify.notification = api;
  }, [api]);

  useEffect(() => {
    contextedModal.modal = modalApi;
  }, [modalApi]);

  useEffect(() => {
    contextedMessage.message = messageApi;
  }, [messageApi]);

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
          Card: {
            padding: designToken.padding,
            paddingLG: designToken.padding,
          },
          Breadcrumb: {
            lastItemColor: designToken.colorPrimary,
          },
          InputNumber: {
            controlWidth: 200,
          },
          Typography: {
            colorLink: designToken.colorPrimary,
            colorLinkActive: designToken.colorPrimary,
            titleMarginBottom: 0,
            titleMarginTop: 0,
          },
          Form: {
            itemMarginBottom: designToken.padding / 2,
          },
        },
      })}
    >
      <ProConfigProvider token={{}}>
        <ThemeProvider>
          <ProgressBar />
          {contextHolder}
          {modalContextHolder}
          {messageContextHolder}
          <Routes darkMode={darkMode} />
          <GlobalStyle />
        </ThemeProvider>
      </ProConfigProvider>
    </ConfigProvider>
  );
}
