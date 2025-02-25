type Warehouse = {
  id: number;
  company_id: number;
  name: string;
  province: string;
  latitude: string;
  longitude: string;
  city: string;
  county: string;
  address: string;
  remark: string;
  status: WarehouseListItemStatus;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;

  created_user: CreateUser;
  company: Company;
};

type WarehouseListItemStatus  =  0 | 1 | 2;