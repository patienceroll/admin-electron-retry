type SalesDeliverMaterialSku = {
  line_unit: LineUnit[];
  batch_no: number;
  project?: BlockProject;
  sales_contract?: BlockSalesContract;
  sales_order?: BlockSalesOrder;
  num: number;
  id: number;
  company_id: number;
  material_id: number;
  name: string;
  code: string;
  attr_snapshoot: AttrSnapshoot;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  material?: BlockMaterail;
  picture?: string;
  picture_path?: string;
  material_sku?: BlockMaterialSku;
  warehouse?: Pick<Warehouse, "id" | "name">;
};
