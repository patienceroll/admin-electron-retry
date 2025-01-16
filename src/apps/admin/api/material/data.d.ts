type Material = {
  /** ID */
  id: string;

  /** 公司id */
  company_id: number;

  /** 一级大类 */
  material_classify_id_1: number;

  /** 二级大类 */
  material_classify_id_2: number;

  /** 物料分类id */
  material_classify_id: number;

  /** 名称 */
  name: string;

  /** 编号 */
  code: string;

  /** 品牌 */
  brand: string;

  /** 型号 */
  model: string;

  /** 单位 */
  unit: string;

  /** 照片 */
  picture: string;

  /** 默认仓库 */
  warehouse_id: number;

  /** 备注 */
  remark: string;

  /** 状态;0:停用,1:有效 */
  status: number;

  /** 创建者id */
  created_id: number;

  /** 删除时间 */
  deleted_at: string;

  /** 更新时间 */
  updated_at: string;

  /** 添加时间 */
  created_at: string;

  /** 权限控制
   * is_edit : 0|1;
   * is_delete : 0|1;
   */
  btn_power: { is_edit: 0 | 1; is_delete: 0 | 1 };

  /** 扩展字段 1 */
  picture_path: string;

  /**
   *  创建人员
   */
  created_user: {
    /**  */
    id: number;

    /** 类型 */
    type: string;

    /** 用户名 */
    name: string;

    /** 手机号 */
    phone: string;

    /** 照片 */
    avatar: string;

    /** 扩展字段 1 */
    avatar_path: string;
  };

  /**
   *  所属公司
   */
  company: {
    /** 主键id */
    id: number;

    /** 名称 */
    name: string;

    /** 简称 */
    short_name: string;
  };

  /**
   *  一级大类
   */
  first_classify: {
    /** 主键id */
    id: number;

    /** 名称 */
    name: string;

    /** 编号 */
    code: string;
  };

  /**
   *  二级大类
   */
  second_classify: {
    /** 主键id */
    id: number;

    /** 名称 */
    name: string;

    /** 编号 */
    code: string;
  };

  /**
   *  类别
   */
  classify: {
    /** 主键id */
    id: number;

    /** 名称 */
    name: string;

    /** 编号 */
    code: string;
  };

  /**
   *  默认仓库
   */
  warehouse: {
    /** 主键id */
    id: number;

    /** 名称 */
    name: string;
  };

  /**
   *  units
   */
  units: {}[];
  /**
   *  仓库信息
   */
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
