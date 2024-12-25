type StockAllot = {
  id: number;
  company_id: number;
  name: string;
  code: string;
  short_name: string;
  province: string;
  city: string;
  county: string;
  is_approve: number;
  address: string;
  bank_information: null;
  remark: string;
  status: BillStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany;
  /** 0未知 1仓库 2项目 */
  type: 0 | 1 | 2 | 4 | 5 | 6 | 7 | 8;
  bill_date: string;
  in_show: string;
  out_show: string;
  client?: BlockClient;
  project?: BlockProject;
  sales_contract?: BlockSalesContract;
};

type StockAllotAddRes = {
  bill_date: string;
  code: string;
  company_id: string;
  created_at: string;
  created_id: number;
  id: number;
  in_id: number;
  in_show: string;
  out_id: number;
  out_show: string;
  type: number;
  updated_at: string;
};
