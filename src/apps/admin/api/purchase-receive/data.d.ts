type PurchaseReceive = {
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  staff?: BlockStaff;
  purchase_order_id: number;
  id: number;
  company_id: number;
  supplier_id: number;
  purchase_contract_id: number;
  project_id: number;
  sales_contract_id: number;
  sales_order_id: number;
  code: string;
  bill_date: string;
  amount: string;
  remark: string;
  status: BillStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  is_approve: number;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany;
  project: BlockProject;
  sales_contract: BlockSalesContract | null;
  sales_order: BlockSalesOrder;
  purchase_contract: {
    id: number;
    code: string;
    name: string;
    status_show: string;
  } | null;
  purchase_order: {
    id: number;
    code: string;
    name: string;
    status_show: string;
  } | null;
  produce_confirm: {
    id: number;
    code: string;
    name: string;
    status_show: string;
  } | null;
  supplier: BlockSupplier;
  detail:
    | {
        id: number;
        material: BlockMaterail;
        material_id: number;
        material_sku: BlockMaterialSku;
        material_sku_id: number;
        num: number;
        produce_receive_id: number;
        remark: string;
        line_unit: LineUnit[];
      }[]
    | null;
};
type PurchaseReceiveMaterialSku = {
  id: number;
  company_id: number;
  material_id: number;
  name: string;
  code: string;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  material_sku: BlockMaterialSku;
  material: BlockMaterail;
};

/** 新增采购收货后返回的数据 */
type PurchaseReceiveAddResponse = Pick<
  PurchaseReceive,
  | "company_id"
  | "client_id"
  | "project_id"
  | "name"
  | "code"
  | "status"
  | "created_id"
  | "created_at"
  | "updated_at"
  | "id"
  | "status_show"
>;
