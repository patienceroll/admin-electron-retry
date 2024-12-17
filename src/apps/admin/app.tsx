import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
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

const Home = lazy(() => import("./pages/home"));
const Blank = lazy(() => import("src/framework/blank"));
const UserInfo = lazy(() => import("./pages/user-info"));
const OrganizationCompany = lazy(() => import("./pages/organization/company"));
const OrganizationDepartment = lazy(
  () => import("./pages/organization/department")
);
const OrganizationStaff = lazy(() => import("./pages/organization/staff"));
const OrganizationStaffCreate = lazy(
  () => import("./pages/organization/staff/create")
);
const OrganizationStaffEdit = lazy(
  () => import("./pages/organization/staff/edit")
);
const OrganizationJob = lazy(() => import("./pages/organization/job"));
const Page404 = lazy(() => import("src/framework/404"));
const FileBussinsefile = lazy(() => import("./pages/file/business-file"));
const FileCompanyfile = lazy(() => import("./pages/file/company-file"));
const CommonOperationLog = lazy(() => import("./pages/common/operation-log"));
const CommonMessage = lazy(() => import("./pages/common/message"));
const CommonUser = lazy(() => import("./pages/common/user"));
const CommonRole = lazy(() => import("./pages/common/role"));
const CommonRoleEdit = lazy(() => import("./pages/common/role/detail"));
const CommonMenu = lazy(() => import("./pages/common/menu"));
const CommonMenuStaff = lazy(() => import("./pages/common/menu-staff"));
const VisualizationArchitecture = lazy(
  () => import("./pages/visualization/architecture")
);
const Client = lazy(() => import("./pages/client/client"));
const ClientDetail = lazy(() => import("./pages/client/client/detail"));
const ClientEdit = lazy(() => import("./pages/client/client/edit"));

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
        },
      })}
    >
      <ProConfigProvider token={{}}>
        <ThemeProvider>
          <ProgressBar />
          {contextHolder}
          {modalContextHolder}
          {messageContextHolder}
          <BrowserRouter basename="/admin">
            <Suspense>
              <Routes>
                <Route path="/" element={<Blank />} />
                <Route path="/home" element={<Home />} />
                <Route path="/user-info" element={<UserInfo />} />

                <Route
                  path="/organization/company"
                  element={<OrganizationCompany />}
                />
                <Route
                  path="/organization/department"
                  element={<OrganizationDepartment />}
                />
                <Route
                  path="/organization/staff"
                  element={<OrganizationStaff />}
                />
                <Route
                  path="/organization/staff/create"
                  element={<OrganizationStaffCreate />}
                />
                <Route
                  path="/organization/staff/edit"
                  element={<OrganizationStaffEdit />}
                />
                <Route path="/organization/job" element={<OrganizationJob />} />
                <Route
                  path="/file/business-file"
                  element={<FileBussinsefile />}
                />
                <Route
                  path="/file/company-file"
                  element={<FileCompanyfile />}
                />

                <Route
                  path="/common/operation-log"
                  element={<CommonOperationLog />}
                />
                <Route path="/common/message" element={<CommonMessage />} />
                <Route path="/common/user" element={<CommonUser />} />
                <Route path="/system/menu" element={<CommonMenu />} />
                <Route
                  path="/common/menu-staff"
                  element={<CommonMenuStaff />}
                />
                <Route path="/system/role" element={<CommonRole />} />
                <Route
                  path="/system/role/detail"
                  element={<CommonRoleEdit />}
                />

                <Route
                  path="/visualization/architecture"
                  element={<VisualizationArchitecture />}
                />

                <Route path="/client/client" element={<Client />} />
                <Route
                  path="/client/client/detail"
                  element={<ClientDetail />}
                />
                <Route path="/client/client/edit" element={<ClientEdit />} />

                <Route path="*" element={<Page404 />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <GlobalStyle />
        </ThemeProvider>
      </ProConfigProvider>
    </ConfigProvider>
  );
}
