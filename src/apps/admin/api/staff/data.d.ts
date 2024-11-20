type StaffListItemStatus = 0 | 1 | 2;

type Staff = {
  avatar: string;
  avatar_path: string;
  code: string;
  id: number;
  ID_card: string;
  name: string;
  phone: string;
  user_id: number;
  wechat: string;
  staff_id: number;
  job: Job;
  department?: Department;
};

/** 员工 */
type StaffListItem = {
  avatar_path?: string;
  id: number;
  user_id: number;
  company_id: number;
  department_id: number;
  job_id: number;
  name: string;
  code: string;
  account: string;
  phone: string;
  wechat: string;
  password: string;
  MD5password: string;
  gender: number;
  ID_card: string;
  birthday: string;
  entry_time: string;
  inner_time: string;
  leave_time: string;
  bank_information: string[];
  emergency_contact: string[];
  educational: string;
  school: string;
  profession: string;
  position_title: string;
  family_address: string;
  current_address: string;
  is_married: number;
  avatar: string;
  remark: string;
  mailbox: string;
  status: StaffStatus;
  is_staff: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  age: string;
  work_month: string;
  work_age: string;
  created_user: BlockCreateUser;
  company?: BlockCompany;
  department?: Department;
  job: Job;
  role: Role[];
};

type StaffDetail = StaffListItem & {
  file: Record<
  BusinessParams["identify"],
  undefined | (Omit<FileResponse, "id"> & { file_id: number })[]
>;
}

/** 员工紧急联系人 */
type StaffContact = {
  id: number;
  company_id: number;
  department_id: number;
  name: string;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: Company;
  department: Department[];
  staff_id: number;
  relation: string;
  work_unit: string;
  phone: string;
};
