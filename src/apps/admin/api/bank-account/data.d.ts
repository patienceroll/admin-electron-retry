/** 账户类型
 * 1-公司,2-客户,3-供应商,4-员工 */
type BankAccountType = 1 | 2 | 3 | 4;

/** 银行账户 */
type BankAccount = {
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
  type: BankAccountType;
  table: string;
  table_id: number;
  company_name: string;
  company_address: string;
  linkman: string;
  bank_name: string;
  bank_address: string;
  tax_code: string;
  account: string;
  type_show: string;
  province?: string;
  city?: string;
  county?: string;
  address?: string;
  longitude?: string;
  latitude?: string;
};
