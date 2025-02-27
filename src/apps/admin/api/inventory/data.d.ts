type InventoryDetailtatus = 0 | 1 | 2;

type Inventory = {
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
  status: InventoryDetailtatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
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
  material: BlockMaterail | null;
  material_sku: BlockMaterialSku | null;
};

type InventoryMaterialSku = {
  id: number;
  company_id: number;
  material_id: number;
  inventory_id: string;
  name: string;
  code: string;

  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  attr_snapshoot: AttrSnapshoot;

  material_sku: BlockMaterialSku;

  material: BlockMaterail;
};

/** 新增库存后返回的数据 */
type InventoryAddResponse = Pick<
  Inventory,
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

type InventorySummary = {
  amount: string;
  material: BlockMaterail;
  material_id: number;
  num: number;

  /** type 为仓库的时候返回 */
  warehouse?: {
    id: number;
    name: string;
  };
  warehouse_id?: number;

  /** type 为项目的时候返回 */
  project?: null;
  project_id?: Project["id"];

  /** 订单的时候返回 */
  sales_order?: null;
  sales_order_id?: SalesOrder["id"];

  sales_contract?: null;
  sales_contract_id?: SalesContract["id"];
};

type InventoryDetailSummary = {
  data: {
    material: {
      brand: string;
      code: string;
      company_id: number;
      created_at: string;
      created_id: number;
      deleted_at: string;
      id: number;
      material_classify_id: number;
      model: string;
      name: string;
      picture: string;
      picture_path: string;
      remark: string;
      status: number;
      unit: string;
      updated_at: string;
      warehouse_id: number;
    };
    warehouse?: {
      address: string;
      city: string;
      company_id: number;
      county: string;
      created_at: string;
      created_id: number;
      deleted_at: string;
      id: number;
      name: string;
      province: string;
      remark: string;
      status: number;
      updated_at: string;
    };
    project: null | Project;
    sales_order: null | SalesOrder;
    sales_contract: null | SalesContract;
  };
  list: {
    amount: string;
    material_sku: BlockMaterialSku;
    material_sku_id: number;
    num: number;
  }[];
};

type InventoryDetailSummaryBatch = {
  amount: string;
  batch_no: string;
  company_id: number;
  created_at: string;
  created_id: number;
  deleted_at: string;
  id: number;
  in_stock: {
    code: string;
    id: number;
    target: string;
    target_code: string;
    target_id: number;
  };
  in_stock_detail_id: number;
  in_stock_id: number;
  inventory_id: number;
  material_id: number;
  material_sku_id: number;
  material_sku: BlockMaterialSku;
  num: number;
  price: string;
  project_id: number;
  remark: null;
  sales_contract_id: number;
  sales_order_id: number;
  status: number;
  updated_at: string;
  warehouse_id: number;
};

type InventoryDetail = {
  barcodes: BlockBarcodes[];
  line_unit: LineUnit[];
  amount: string;
  batch_no: string;
  company_id: number;
  created_at: string;
  created_id: number;
  deleted_at: string;
  id: number;
  in_stock_detail_id: number;
  in_stock_id: number;
  inventory_id: number;
  is_self_produced: number;
  material: BlockMaterail;
  material_id: number;
  material_sku: BlockMaterialSku;
  material_sku_id: number;
  num: number;
  price: string;
  project: BlockProject;
  project_id: number;
  remark: string;
  sales_contract: BlockSalesContract;
  sales_contract_id: number;
  sales_order: BlockSalesOrder;
  sales_order_detail_id: number;
  sales_order_id: number;
  status: number;
  unit: string;
  updated_at: string;
  warehouse: {
    id: number;
    name: string;
  };
  warehouse_id: number;
};
