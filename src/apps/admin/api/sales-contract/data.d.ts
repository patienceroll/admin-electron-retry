type SalesContractListItem = {
  quality_ratio: string;
  advance_ratio: number;
  id: number;
  company_id: number;
  client_id: number;
  project_id: number;
  type: number;
  pid: number;
  name: string;
  code: string;
  tax_rate: number;
  amount: string;
  sign_date: string;
  sign_address: string;
  staff_id: number;
  sign_staff_id: number;
  settle_staff_id: number;
  client_contact_id: number;
  inspect_client_contact_id: number;
  settle_client_contact_id: number;
  settle_type: string;
  payment_type: number;
  advance_amount: string;
  collect_bank_account_id: number;
  invoice_bank_account_id: number;
  is_factory_dispatch: number;
  remark: string;
  is_approve: number;
  status: BillStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  status_show: string;
  created_user: User;
  company: Company;
  client: Client | null;
  staff: Staff | null;
  sign_staff: Staff | null;
  settle_client_contact?: {
    id: number;
    name: string | null;
    short_name: string | null;
  };
  settle_staff?: Staff;
  project?: Project;
  client_contact?: {
    id: number;
    name: string | null;
    short_name: string | null;
  };
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  detail?: {
    id: number;
    material: Materail;
    material_id: number;
    material_sku: MaterialSku;
    material_sku_id: number;
    num: number;
    produce_receive_id: number;
    remark: string;
    line_unit: LineUnit[];
  }[];
};

type SalesContractMaterialSku = {
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
  material: Materail;
  picture?: string;
  picture_path?: string;
};

/** 新增销售合同后返回的数据 */
type SalesContractAddResponse = Pick<
  SalesContract,
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
