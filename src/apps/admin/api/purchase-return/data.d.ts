type PurchaseReturn = {
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  staff?: BlockStaff;
  id: number;
  company_id: number;
  code: string;
  supplier_id: number;
  project_id: number;
  sales_contract_id: number;
  sales_order_id: number;
  purchase_contract_id: number;
  purchase_order_id: number;
  purchase_receive_id: number;
  bill_date: string;
  amount: string;
  remark: string;
  status: BillStatus;
  created_id: number;
  deleted_at: string;
  is_approve: number;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany | null;
  sales_contract: BlockSalesContract | null;
  sales_order: BlockSalesOrder | null;
  purchase_contract: {
    id: number;
    code: string;
    name: string;
    status_show: string;
  } | null;
  supplier: BlockSupplier | null;
  purchase_order: {
    id: number;
    code: string;
    status_show: string;
  } | null;
  purchase_receive: {
    id: number;
    code: string;
    status_show: string;
  } | null;
  produce_confirm: {
    id: number;
    code: string;
    status_show: string;
  } | null;
  project: BlockProject | null;
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
type PurchaseReturnMaterialSku = {
  id: number;
  company_id: number;
  material_id: number;
  name: string;
  batch_no: string;
  code: string;
  project?: BlockProject;
  sales_contract?: BlockSalesContract;
  sales_order?: BlockSalesOrder;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  material_sku: BlockMaterialSku;
  line_unit: LineUnit[];
  warehouse?: {
    id: number;
    name: string;
  };
  material: BlockMaterail;
};

/** 新增采购收货后返回的数据 */
type PurchaseReturnAddResponse = Pick<
  PurchaseReturn,
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
