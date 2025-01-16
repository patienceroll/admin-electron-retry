type MaterialClassify = {
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

  /** 上级id */
  pid: number;

  /** 名称 */
  name: string;

  /** 编号 */
  code: string;

  /** 备注 */
  remark: string;

  /** 排序号 */
  list: number;

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
  } | null;

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
  } | null;

  /**
   *  materialAttr
   */
  material_attr:
    | {
        /** 主键id */
        id: number;

        /** 物料分类id */
        material_classify_id: number;

        /** 物料属性id */
        material_attr_id: number;

        /** 键值 */
        key: string;

        /** 名称 */
        name: string;

        /** 排序号 */
        list: number;
      }[];
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
