type SalesReturn = {
    id: number;
    company_id: number;
    client_id: number;
    project_id: number;
    sales_contract_id: number;
    sales_order_id: number;
    code: string;
    sales_deliver_id: string;
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
    file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  
    created_user: BlockCreateUser;
    company: BlockCompany | null;
    client: BlockClient;
  
    project: BlockProject | null;
    staff: BlockStaff;
    sales_contract: BlockSalesContract;
    sales_order: BlockSalesOrder;
    sales_deliver: {
      id: number;
      code: string;
      status_show: string;
    } | null;
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


  type SalesReturnMaterialSku = {
    id: number;
    company_id: number;
    material_id: number;
    name: string;
    code: string;
    attr_snapshoot: AttrSnapshoot;
    material_sku: BlockMaterialSku;
    status: number;
    created_id: number;
    deleted_at: string;
    updated_at: string;
    created_at: string;
    btn_power: BtnPower;
    material: BlockMaterail;
    picture?: string;
    picture_path?: string;
  };