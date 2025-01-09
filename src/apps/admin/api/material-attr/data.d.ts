type MaterialAttr = {
    id: number;
    company_id: number;
    material_classify_id: number;
    name: string;
    list: number;
    status: number;
    created_id: number;
    deleted_at: string;
    updated_at: string;
    created_at: string;
    btn_power: BtnPower;
    detail: {
      id: number;
      material_attr_id: number;
      value: string;
      list: number;
      color?: string;
    }[];
  };
  