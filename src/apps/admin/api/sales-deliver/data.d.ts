type SalesDeliver = {
  is_approve: 0 | 1;
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
  file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  sales_order: BlockSalesOrder;
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

/** 新增销售发货单后返回的数据 */
type SalesDeliverAddResponse = Pick<
  SalesDeliver,
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
