type Material = {
    material_classify: {
      id: number;
      name: string;
      code: string;
    };
    id: number;
    company_id: number;
    material_classify_id: number;
    name: string;
    code: string;
    brand: string;
    model: string;
    unit: string;
    remark: string;
    status: number;
    created_id: number;
    deleted_at: string;
    updated_at: string;
    created_at: string;
    btn_power: BtnPower;
    created_user: BlockCreateUser;
    warehouse?: Pick<Warehouse, "name" | "id">;
    picture_path?: string;
    picture?: string;
    company: BlockCompany;
    classify: { code: string; id: number; name: string } | null;
    units: Array<MaterialOfAttrUnit>;
  };
  
  type MaterialOfAttrUnit = {
    alias: string;
    id: number;
    is_main: number;
    material_id: number;
    unit: string;
  };
  
  /** 物资所拥有的attr */
  type MaterialOfAttr = {
    id: number;
    name: string;
    detail: {
      id: number;
      material_attr_id: number;
      value: string;
      is_select: number | 1;
    }[];
  };
  
  type MaterialSku = {
    picture?: string;
    picture_path?: string;
    id: number;
    company_id: number;
    material_id: number;
    name: string;
    code: string;
    o_diameter: string;
    wall_thickness: string;
    i_coat_thickness: string;
    o_coat_thickness: string;
    length: string;
    connection_type: string;
    steel_type: string;
    texture: string;
    i_coat_color: string;
    o_coat_color: string;
    attr_snapshoot: AttrSnapshoot;
    status: number;
    created_id: number;
    deleted_at: string;
    updated_at: string;
    created_at: string;
    btn_power: BtnPower;
    material: BlockMaterail;
  };
  