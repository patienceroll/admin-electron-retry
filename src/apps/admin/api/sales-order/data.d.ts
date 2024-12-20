type SalesOrder = {
    quality_ratio: string;
    tax_rate: string;
    file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
    id: number;
    company_id: number;
    client_id: number;
    project_id: number;
    sales_contract_id: number;
    code: string;
    bill_date: string;
    delivery_date: string;
    batch_no: string;
    staff_id: number;
    remark: string;
    amount: string;
    no_tax_amount: string;
    is_urgent: number;
    is_delay: number;
    is_approve: number;
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
    advance_ratio: number;
    project: BlockProject | null;
    sales_contract: BlockSalesContract | null;
    staff: BlockStaff | null;
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
  type SalesOrderMaterialSku = {
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
    material_sku: BlockMaterialSku | null;
    material: BlockMaterail;
    picture_path?: string;
    attr_snapshoot: AttrSnapshoot;
  };
  
  /** 新增子合同需求单后返回的数据 */
  type SalesOrderAddResponse = Pick<
    SalesOrder,
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
  