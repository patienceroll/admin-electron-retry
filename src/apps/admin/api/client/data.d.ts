type ClientListItem = {
  name_show: string;
  abandon_remark: string;
  abandon_time: string;
  address: string;
  bid_open_time: string;
  btn_power: BtnPower;
  build_content: null;
  capital_source: string;
  category: string;
  city: string;
  client: null;
  client_id: number;
  code: string;
  company: Company;
  company_id: number;
  contact: {
    client_id: number;
    contact_phone: string;
    id: number;
    ID_card: string;
    is_main: number;
    job_title: string;
    name: string;
    phone: string;
    project_id: number;
    status: number;
    wechat: string;
  }[];
  county: string;
  created_at: string;
  created_id: number;
  created_user: User;
  deleted_at: string;
  estimated_amount: string;
  hang_time: string;
  id: number;
  investment_amount: string;
  is_abandon: number;
  is_approve: number;
  is_importance: number;
  is_importance_show: string;
  is_sign: number;
  is_sign_show: string;
  latitude: string;
  longitude: string;
  name: string;
  nature: string;
  project: Project;

  project_id: number;
  province: string;
  purchase_date: string;
  remark: null;
  short_name: string;
  staff: Staff | null;
  staff_id: number;
  status: number;
  status_show: string;
  type: number;
  type_show: string;
  updated_at: string;
  win_bid_amount: string;
};

/** 新增客户后返回的数据 */
type ClientAddResponse = Pick<
  ClientListItem,
  | "company_id"
  | "client_id"
  | "project_id"
  | "name"
  | "status"
  | "created_id"
  | "created_at"
  | "updated_at"
  | "id"
  | "status_show"
>;
