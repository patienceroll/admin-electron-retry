import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
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
const ClientContant = lazy(() => import("./pages/client/client-contact"));

const BusinessOpportunity = lazy(() => import("./pages/business-opportunity"));
const BusinessOpportunityDetail = lazy(
  () => import("./pages/business-opportunity/detail")
);
const BusinessOpportunityEdit = lazy(
  () => import("./pages/business-opportunity/edit")
);

/**
 * 销售管理模块
 */
//销售合同
const SalesContract = lazy(() => import("./pages/sales/sales-contract"));
const SalesContractDetail = lazy(
  () => import("./pages/sales/sales-contract/detail")
);
const SalesContractEdit = lazy(
  () => import("./pages/sales/sales-contract/edit")
);
//销售订单
const SalesOrder = lazy(() => import("./pages/sales/sales-order"));
const SalesOrderEdit = lazy(() => import("./pages/sales/sales-order/edit"));
const SalesOrderDetail = lazy(() => import("./pages/sales/sales-order/detail"));
//销售发货
const SalesDeliver = lazy(() => import("./pages/sales/sales-deliver"));
//销售退货
const SalesReturn = lazy(() => import("./pages/sales/sales-return"));

/**
 * 采购管理模块
 */
//采购申请
const PurchaseApply = lazy(() => import("./pages/purchase/purchase-apply"));
//采购合同
const PurchaseContract = lazy(
  () => import("./pages/purchase/purchase-contract")
);
//采购订单
const PurchaseOrder = lazy(() => import("./pages/purchase/purchase-order"));
//采购收货
const PurchaseReceive = lazy(() => import("./pages/purchase/purchase-receive"));
//采购退货
const PurchaseReturn = lazy(() => import("./pages/purchase/purchase-return"));

/**
 * 库存管理模块
 */
//入库单
const InStock = lazy(() => import("./pages/inventory/in-stock"));
//出库单
const OutStock = lazy(() => import("./pages/inventory/out-stock"));
//发货单
const DeliverOrder = lazy(() => import("./pages/inventory/deliver-order"));
//收货单
const ReceiveOrder = lazy(() => import("./pages/inventory/receive-order"));
//收货单
const WarehouseLog = lazy(() => import("./pages/inventory/warehouse-log"));
//盘点单
const StockCheck = lazy(() => import("./pages/inventory/stock-check"));
//调拨单
const StockAllot = lazy(() => import("./pages/inventory/stock-allot"));

/**
 * 生产管理模块
 */
//领料单
const ProduceReceive = lazy(() => import("./pages/produce/produce-receive"));
//退料单
const ProduceReturn = lazy(() => import("./pages/produce/produce-return"));

const Project = lazy(() => import("./pages/project/project"));
const ProjectEdit = lazy(() => import("./pages/project/project/edit"));
const ProjectDetail = lazy(() => import("./pages/project/project/detail"));

const Material = lazy(() => import("./pages/material/material"));
const MaterialEdit = lazy(() => import("./pages/material/material/edit"));

export default function (props: { darkMode: boolean }) {
  const { darkMode } = props;
  const [isPackaged] = useState(() => window.preload.isPackaged);
  const routes = (
    <Suspense>
      <Routes>
        <Route path="/" element={<Blank />} />
        <Route path="/home" element={<Home darkMode={darkMode} />} />
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

        <Route
          path="/business-opportunity/business-opportunity"
          element={<BusinessOpportunity />}
        />
        <Route
          path="/business-opportunity/business-opportunity/detail"
          element={<BusinessOpportunityDetail />}
        />
        <Route
          path="/business-opportunity/business-opportunity/edit"
          element={<BusinessOpportunityEdit />}
        />

        <Route path="/sales/sales-contract" element={<SalesContract />} />
        <Route
          path="/sales/sales-contract/detail"
          element={<SalesContractDetail />}
        />
        <Route
          path="/sales/sales-contract/edit"
          element={<SalesContractEdit />}
        />
        
        <Route path="/sales/sales-order" element={<SalesOrder />} />
        <Route path="/sales/sales-order/edit" element={<SalesOrderEdit />} />
        <Route path="/sales/sales-order/detail" element={<SalesOrderDetail />} />


        <Route path="/sales/sales-deliver" element={<SalesDeliver />} />
        <Route path="/sales/sales-return" element={<SalesReturn />} />

        <Route path="/purchase/purchase-apply" element={<PurchaseApply />} />
        <Route
          path="/purchase/purchase-contract"
          element={<PurchaseContract />}
        />
        <Route path="/purchase/purchase-order" element={<PurchaseOrder />} />
        <Route
          path="/purchase/purchase-receive"
          element={<PurchaseReceive />}
        />
        <Route path="/purchase/purchase-return" element={<PurchaseReturn />} />

        <Route path="/inventory/in-stock" element={<InStock />} />
        <Route path="/inventory/out-stock" element={<OutStock />} />
        <Route path="/inventory/deliver-order" element={<DeliverOrder />} />
        <Route path="/inventory/receive-order" element={<ReceiveOrder />} />
        <Route path="/inventory/warehouse-log" element={<WarehouseLog />} />
        <Route path="/inventory/stock-check" element={<StockCheck />} />
        <Route path="/inventory/stock-allot" element={<StockAllot />} />

        <Route path="/produce/produce-receive" element={<ProduceReceive />} />
        <Route path="/produce/produce-return" element={<ProduceReturn />} />

        <Route path="/project/project" element={<Project />} />
        <Route path="/project/project/edit" element={<ProjectEdit />} />
        <Route path="/project/project/detail" element={<ProjectDetail />} />

        <Route path="/material/material" element={<Material />} />
        <Route path="/material/material/edit" element={<MaterialEdit />} />

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
