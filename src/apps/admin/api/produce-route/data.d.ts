type ProduceRoute = {
  id: number;
  company_id: number;
  name: string;
  code: string;
  remark: string;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany;
  process: {
    id: number;
    name: string;
    code: string;
    list: number;
    laravel_through_key: number;
  }[];
};
