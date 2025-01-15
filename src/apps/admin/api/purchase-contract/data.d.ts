type PurchaseContract = {
  id: number;
  company_id: number;
  supplier_id: number;
  type: number;
  pid: number;
  name: string;
  code: string;
  sign_date: string;
  staff_id: number;
  amount: string;
  remark: string;
  is_approve: 0 | 1;
  status: BillStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany;
  supplier: BlockSupplier;
  staff: BlockStaff;
  tax_rate: string;
  bill_date: string;
  client?: BlockClient;
  project?: BlockSalesContract;
  sales_contract?: BlockSalesContract;
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
};

type PurchaseContractMaterialSku = {
  id: number;
  company_id: number;
  material_id: number;
  name: string;
  code: string;
  o_diameter: string;
  wall_thickness: string;
  i_coat_thickness: string;
  o_coat_thickness: string;
  length: string;
  connection_type: string;
  steel_type: string;
  texture: string;
  i_coat_color: string;
  o_coat_color: string;
  attr_snapshoot: AttrSnapshoot;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  material: BlockMaterail;
};

/** 新增采购合同后返回的数据 */
type PurchaseContractAddResponse = Pick<
  PurchaseContract,
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
