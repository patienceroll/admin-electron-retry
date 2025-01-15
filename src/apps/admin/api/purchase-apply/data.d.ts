type PurchaseApply = {
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  staff?: BlockStaff;
  id: number;
  company_id: number;
  type: number;
  project_id: number;
  sales_contract_id: number;
  sales_order_id: number;
  produce_confirm_id: number;
  code: string;
  bill_date: string;
  is_approve: 0 | 1;
  expect_receive_time: string;
  remark: string;
  is_urgent: number;
  status: BillStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  status_show: string;
  created_user: BlockCreateUser;
  company: BlockCompany | null;
  project: BlockProject | null;
  sales_contract: BlockSalesContract | null;
  sales_order: BlockSalesOrder;
  produce_confirm: {
    id: number;
    code: string;
    status_show: string;
  };
};
type PurchaseApplyMaterialSku = {
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
  picture?: string;
  picture_path?: string;
  material: BlockMaterail;
};

/** 新增销售合同后返回的数据 */
type PurchaseApplyAddResponse = Pick<
  PurchaseApply,
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
