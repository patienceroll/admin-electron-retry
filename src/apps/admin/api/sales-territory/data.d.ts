type Area = {
  btn_power: BtnPower;
  code: string;
  color: string;
  company: Company;
  company_id: number;
  created_at: string;
  created_id: number;
  created_user: User;
  deleted_at: string;
  id: number;
  name: string;
  region: {
    area_id: number;
    city: string;
    code: string;
    county: string;
    id: number;
    province: string;
  }[];
  remark: string;
  staff: Staff[];
  status: number;
  updated_at: string;
};

type ReginTree = {
  name: string;
  code: string;
  is_checked?: 0 | 1;
  child?: ReginTree[];
};
