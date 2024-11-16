type JobListItemStatus = 0 | 1 | 2;

type Job = {};

type JobListItem = {
  id: number;
  company_id: number;
  department_id: number;
  name: string;
  status: JobListItemStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company?: Company;
  department: Department[];
  remark: string;
};
