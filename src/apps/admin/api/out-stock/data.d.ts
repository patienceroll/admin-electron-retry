type OutStock = {
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
  status: BillStatus;
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

type OutStockMaterialSku = {
  barcodes: BlockBarcodes[];
  line_unit: LineUnit[];
  id: number;
  company_id: number;
  material_id: number;
  inventory_id: string;
  name: string;
  code: string;
  num: number;
  batch_no: string;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  attr_snapshoot: AttrSnapshoot;

  material_sku: BlockMaterialSku;
  warehouse: {
    id: number;
    name: string;
    short_name: string;
  } | null;
  material: BlockMaterail;
  project?: BlockProject;
  sales_contract?: BlockSalesContract;
  sales_order?: BlockSalesOrder;
};

/** 新增入库单后返回的数据 */
type OutStockAddResponse = Pick<
  OutStock,
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
