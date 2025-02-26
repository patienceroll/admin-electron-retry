type Driver = {
  id: number;
  company_id: number;
  is_own: number;
  logistics_company_id: number;
  name: string;
  phone: string;
  age: number;
  driver_age: number;
  status: 0|1|2;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany;
  logistics_company: {
    id: number;
    name: string;
  } | null;
};
