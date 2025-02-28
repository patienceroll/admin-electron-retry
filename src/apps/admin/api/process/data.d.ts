type ApprovalProcess = {
  id: number;
  company_id: number;
  name: string;
  code: string;
  remark: string | null;
  status: Processtatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: BlockCompany;
};

type Processtatus = 0 | 1 | 2;
