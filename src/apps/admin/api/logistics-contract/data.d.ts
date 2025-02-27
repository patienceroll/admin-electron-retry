type LogisticsContract = {
  id: number;
  company_id: number;
  logistics_company_id: number;
  name: string;
  code: string;
  driver_id: number;
  remark: string;
  status: number;
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
  driver: {
    id: number;
    name: string;
  };
};

type LogisticsContractStatus = 0 | 1 | 2;