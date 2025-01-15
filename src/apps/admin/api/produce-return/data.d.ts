type ProduceReturn = {
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;

  id: number;
  company_id: number;
  client_id: number;
  project_id: number;
  sales_contract_id: number;
  sales_order_id: number;
  code: string;
  receive_man: string;
  receive_tel: string;
  receive_address: string;
  remark: string;
  bill_date: string;
  staff_id: number;
  amount: string;
  status: BillStatus;
  is_approve: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  status_show: string;
  created_user: BlockCreateUser;
  company: BlockCompany;
  client: BlockClient;
  project: BlockProject | null;
  staff: BlockStaff;
  sales_contract: BlockSalesContract;
  sales_order: BlockSalesOrder;
  produce_complete: {
    id: number;
    code: string;
    status_show: string;
  };
  warehouse: {
    id: number;
    name: string;
    status_show: string;
  };
  staff: BlockStaff;
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
      }[]
    | null;
};
type ProduceReturnMaterialSku = {
  id: number;
  company_id: number;
  material_id: number;
  attr_snapshoot: AttrSnapshoot;

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
  barcodes: BlockBarcodes[];
};

/** 新增销售发货单后返回的数据 */
type ProduceReturnAddResponse = Pick<
  ProduceReturn,
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
