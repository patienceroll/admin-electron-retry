type InStock = {
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  remark: string;
  id: number;
  company_id: number;
  project_id: number;
  sales_contract_id: number;
  sales_order_id: number;
  warehouse_id: number;
  target: string;
  target_id: number;
  target_code: string;
  code: string;
  bill_date: string;
  batch_no: string;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  is_approve: number;
  status: InStockStatus;
  created_user: BlockCreateUser;
  company: BlockCompany | null;
  project: BlockProject | null;
  sales_contract: BlockSalesContract | null;
  sales_order: BlockSalesOrder | null;
  warehouse: {
    id: number;
    name: string;
    short_name: string;
  } | null;
};

type InStockMaterialSku = {
  id: number;
  company_id: number;
  material_id: number;
  inventory_id: string;
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
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  attr_snapshoot: AttrSnapshoot;
  picture?: string;
  picture_path?: string;

  material: BlockMaterail;
};

/** 新增入库单后返回的数据 */
type InStockAddResponse = Pick<
  InStock,
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
