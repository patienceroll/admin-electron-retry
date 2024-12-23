type BusinessOpportunity = {
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

  /** 编号 */
  code: string;

  /** 名称 */
  name: string;

  /** 简称 */
  short_name: string;

  /** 项目类别 */
  category: string;

  /** 建设内容 */
  build_content: string;

  area?: Area;
  /** 区域id */
  area_id: number;

  /** 省 */
  province: string;

  /** 市 */
  city: string;

  /** 区 */
  county: string;

  /** 详细地址 */
  address: string;

  /** 经度 */
  longitude: string;

  /** 纬度 */
  latitude: string;

  /** 项目总投资金额 */
  investment_amount: string;

  /** 工程预估价值(万) */
  estimated_amount: string;

  /** 资金来源 */
  capital_source: string;

  /** 挂网时间 */
  hang_time: number;

  /** 开标时间 */
  bid_open_time: number;

  /** 采购时间 */
  purchase_date: number;

  /** 中标金额 */
  win_bid_amount: string;

  /** 重点项目;0:否,1:是 */
  is_importance: number;

  /** 行业 */
  trade: string;

  /** 项目状态 */
  project_status: string;

  /** 是否放弃;0:否,1:是 */
  is_abandon: number;

  /** 放弃备注 */
  abandon_remark: string;

  /** 放弃时间 */
  abandon_time: number;

  /** 负责人id */
  staff_id: number;

  /** 信息完善度 */
  perfect_ratio: number;

  /** 备注 */
  remark: string;

  /** 是否审批中;0:否,1:是 */
  is_approve: number;

  /** 状态;0:草稿,1:机会,2:已立项,3:已作废 */
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
   * is_move : 0|1;
   */
  btn_power: { is_edit: 0 | 1; is_delete: 0 | 1; is_move: 0 | 1 };

  /** 扩展字段 1 */
  is_importance_show: string;

  /** 扩展字段 2 */
  name_show: string;

  /** 扩展字段 3 */
  status_show: string;

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
   *  area
   */
  /**
   *  员工信息
   */
  staff: {
    /** 主键id */
    id: number;

    /** 用户名 */
    name: string;

    /** 手机号 */
    phone: string;

    /** 照片 */
    avatar: string;

    /** 扩展字段 1 */
    avatar_path: string;
  } | null;
};


/** 新增项目后返回的数据 */
type BusinessOpportunityAddResponse = Pick<
  BusinessOpportunity,
  | "company_id"
  | "client_id"
  | "project_id"
  | "name"
  | "code"
  | "status"
  | "created_id"
  | "created_at"
  | "updated_at"
  | "id"
  | "status_show"
>;