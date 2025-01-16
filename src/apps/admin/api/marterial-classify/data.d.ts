type MaterialClassify = {
  id: number;
  company_id: number;
  pid: number;
  name: string;
  code: string;
  list: null;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: CreateUser;
  company: Company;
  material_attr: MaterialAttr[];
};

type MaterialClassifyTree = {
  child?: MaterialClassifyTree[];
  code: string;
  id: number;
  list: null;
  name: string;
  pid: number;
  status: number;
};
