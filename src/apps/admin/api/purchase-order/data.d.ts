type PurchaseOrder = {
  advance_amount: string;
  tax_rate: string;
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  staff?: BlockStaff;
  id: number;
  company_id: number;
  type: number;
  supplier_id: number;
  purchase_contract_id: number;
  project_id: number;
  sales_contract_id: number;
  sales_order_id: number;
  code: string;
  receive_man: string;
  receive_tel: string;
  receive_address: string;
  bill_date: string;
  amount: string;
  freight_amount: string;
  delivery_date: string;
  staff_id: number;
  remark: string;
  is_approve: 0 | 1;
  is_urgent: number;
  status: BillStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  status_show: string;
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
  };
  purchase_apply: {
    id: number;
    code: string;
    name: string;
    status_show: string;
  };
  produce_confirm: {
    id: number;
    code: string;
    name: string;
    status_show: string;
  };
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
type PurchaseOrderMaterialSku = {
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

/** 新增采购订单后返回的数据 */
type PurchaseOrderAddResponse = Pick<
  PurchaseOrder,
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
