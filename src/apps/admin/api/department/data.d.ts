/** 部门列表项 */
type DepartmentListItem = {
  id: number;
  company_id: number;
  pid: number;
  name: string;
  department_level_id: number;
  identify: string;
  staff_id: number;
  remark: string;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  job_count: number;
  employee_count: number;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company?: Company;
  staff?: Staff;
  p_department?: { name: string };
  department_level: null;
};

/** 部门树形item */
type DepartmentTreeItem = {
  child?: DepartmentTree[];
  employee?: {
    avatar: string;
    code: string;
    department_id: number;
    id: number;
    job_id: number;
    name: string;
    phone: string;
    status: number;
  }[];
  id: number;
  identify: string;
  job?: Job[];
  name?: string;
  pid?: number;
  remark?: string;
  staff?: Staff;
  staff_id?: number;
  status?: number;
};
