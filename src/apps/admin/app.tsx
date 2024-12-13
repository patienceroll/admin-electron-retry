import React, { useEffect, useState } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
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

import Home from "./pages/home";
import UserInfo from "./pages/user-info";
import OrganizationCompany from "./pages/organization/company";
import OrganizationDepartment from "./pages/organization/department";
import OrganizationStaff from "./pages/organization/staff";
import OrganizationStaffCreate from "./pages/organization/staff/create";
import OrganizationStaffEdit from "./pages/organization/staff/edit";
import OrganizationJob from "./pages/organization/job";
import Page404 from "src/framework/404";
import FileBussinsefile from "./pages/file/business-file";
import FileCompanyfile from "./pages/file/company-file";
import CommonOperationLog from "./pages/common/operation-log";
import CommonMessage from "./pages/common/message";
import CommonUser from "./pages/common/user";
import CommonRole from "./pages/common/role";
import CommonRoleEdit from "./pages/common/role/detail";
import CommonMenu from "./pages/common/menu";
import CommonMenuStaff from "./pages/common/menu-staff";
import VisualizationArchitecture from "./pages/visualization/architecture";
import Client from "./pages/client/client";
import ClientDetail from "./pages/client/client/detail";
import ClientEdit from "./pages/client/client/edit";

import contextedNotify from "src/framework/component/contexted-notify";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";

export default function () {
  const [themebase, setThemeBase] = useState(() => window.preload.getTheme());
  const [darkMode, setDarkMode] = useState(() => window.preload.darkMode);

  const [api, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const algorithm = [
    darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  ]

  if (themebase.layout === 'compact') {
    algorithm.push(theme.compactAlgorithm)
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
        },
      })}
    >
      <ProConfigProvider token={{}}>
        <ThemeProvider>
          <ProgressBar />
          {contextHolder}
          {modalContextHolder}
          {messageContextHolder}
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
              <Route path="/organization/staff" Component={OrganizationStaff} />
              <Route
                path="/organization/staff/create"
                Component={OrganizationStaffCreate}
              />
              <Route
                path="/organization/staff/edit"
                Component={OrganizationStaffEdit}
              />
              <Route path="/organization/job" Component={OrganizationJob} />
              <Route path="/file/business-file" Component={FileBussinsefile} />
              <Route path="/file/company-file" Component={FileCompanyfile} />

              <Route
                path="/common/operation-log"
                Component={CommonOperationLog}
              />
              <Route path="/common/message" Component={CommonMessage} />
              <Route path="/common/user" Component={CommonUser} />
              <Route path="/system/menu" Component={CommonMenu} />
              <Route path="/common/menu-staff" Component={CommonMenuStaff} />
              <Route path="/system/role" Component={CommonRole} />
              <Route path="/system/role/detail" Component={CommonRoleEdit} />

              <Route
                path="/visualization/architecture"
                Component={VisualizationArchitecture}
              />

              <Route path="/client/client" Component={Client} />
              <Route path="/client/client/detail" Component={ClientDetail} />
              <Route path="/client/client/edit" Component={ClientEdit} />

              <Route path="*" element={<Page404 />} />
            </Routes>
          </HashRouter>
          <GlobalStyle />
        </ThemeProvider>
      </ProConfigProvider>
    </ConfigProvider>
  );
}
