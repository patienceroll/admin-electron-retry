type User = {
  account: string;
  avatar: string;
  avatar_path: string;
  company_id: number;
  company_list: Company[];
  created_at: string;
  created_id: number;
  deleted_at: string;
  device_id: string;
  id: number;
  login_failed: number;
  login_ip: string;
  login_time: string;
  MD5password: string;
  name: string;
  password: string;
  phone: string;
  staff: null;
  status: number;
  type: string;
  updated_at: string;
};

type UserMenu = {
  child?: UserMenu[];
  icon: string;
  id: number;
  is_force: number;
  level: number;
  list: number;
  menu_department: string[];
  menu_staff: string[];
  name: string;
  path: string;
  permission: Permission[];
  pid: number;
  slug: string;
  status: number;
}