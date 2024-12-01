type OperationLogListItem = {
  id: number;
  company_id: number;
  department_id: number;
  name: string;
  status: number;
  created_id: number;
  deleted_at: string;
  remark: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: CreateUser;
  company: Company;
  user: User;
  department: Department[];
};
