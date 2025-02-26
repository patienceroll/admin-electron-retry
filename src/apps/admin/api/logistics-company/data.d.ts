type LogisticsCompanyListItemStatus = 0 | 1 | 2

type LogisticsCompany = {
  id: number;
  company_id: number;
  name: string;
  remark: string;
  status: LogisticsCompanyListItemStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany;
};
