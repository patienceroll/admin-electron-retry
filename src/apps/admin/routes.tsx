import { Route, BrowserRouter, MemoryRouter, Routes } from "react-router-dom";
import React, { lazy, Suspense, useState } from "react";

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
const ClientContant = lazy(() => import("./pages/client/client-contact"))

export default function () {
  const [isPackaged] = useState(() => window.preload.isPackaged);
  const routes = (
    <Suspense>
      <Routes>
        <Route path="/" element={<Blank />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-info" element={<UserInfo />} />

        <Route path="/organization/company" element={<OrganizationCompany />} />
        <Route
          path="/organization/department"
          element={<OrganizationDepartment />}
        />
        <Route path="/organization/staff" element={<OrganizationStaff />} />
        <Route
          path="/organization/staff/create"
          element={<OrganizationStaffCreate />}
        />
        <Route
          path="/organization/staff/edit"
          element={<OrganizationStaffEdit />}
        />
        <Route path="/organization/job" element={<OrganizationJob />} />
        <Route path="/file/business-file" element={<FileBussinsefile />} />
        <Route path="/file/company-file" element={<FileCompanyfile />} />

        <Route path="/common/operation-log" element={<CommonOperationLog />} />
        <Route path="/common/message" element={<CommonMessage />} />
        <Route path="/common/user" element={<CommonUser />} />
        <Route path="/system/menu" element={<CommonMenu />} />
        <Route path="/common/menu-staff" element={<CommonMenuStaff />} />
        <Route path="/system/role" element={<CommonRole />} />
        <Route path="/system/role/detail" element={<CommonRoleEdit />} />

        <Route
          path="/visualization/architecture"
          element={<VisualizationArchitecture />}
        />

        <Route path="/client/client" element={<Client />} />
        <Route path="/client/client/detail" element={<ClientDetail />} />
        <Route path="/client/client/edit" element={<ClientEdit />} />
        <Route path="/client/client-contact" element={<ClientContant />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );

  return isPackaged ? (
    <MemoryRouter initialEntries={["/"]}>{routes}</MemoryRouter>
  ) : (
    <BrowserRouter basename="/admin">{routes}</BrowserRouter>
  );
}
