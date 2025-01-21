type SalesOrder = {
    /**
   *  附件信息
   */
    file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

  /** 客户id */
  client_id: number;

  /** 项目id */
  project_id: number;

  /** 销售合同id */
  sales_contract_id: number;

  /** 编号 */
  code: string;

  /** 单据日期 */
  bill_date: number;

  /** 交货日期 */
  delivery_date: number;

  /** 批次号 */
  batch_no: string;

  /** 负责人id */
  staff_id: number;

  /** 备注 */
  remark: string;

  /** 税率 */
  tax_rate: number;

  /** 金额 */
  amount: string;

  /** 预付款比例 */
  advance_ratio: number;

  /** 质保金比例 */
  quality_ratio: number;

  /** 去税合计 */
  no_tax_amount: string;

  /** 是否加急;0:否,1:是 */
  is_urgent: number;

  /** 是否延期;0:否,1:是 */
  is_delay: number;

  /** 是否审批中;0:否,1:是 */
  is_approve: number;

  /** 状态;0:草稿,1:待执行,2:执行中,3:已完结,4:已中止,5:已作废 */
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
   *  客户信息
   */
  client: {
    /** 主键id */
    id: number;

    /** 公司 */
    name: string;

    /** 简称 */
    short_name: string;

    /** 扩展字段 1 */
    type_show: string;

    /** 扩展字段 2 */
    is_sign_show: string;

    /** 扩展字段 3 */
    name_show: string;

    /** 扩展字段 4 */
    status_show: string;
  } | null;

  /**
   *  项目信息
   */
  project: {
    /** 主键id */
    id: number;

    /** 编号 */
    code: string;

    /** 项目名称 */
    name: string;

    /** 简称 */
    short_name: string;

    /** 状态;0:草稿,1:待签约,2:履约中,3:已完结,4:已中止,5:已放弃 */
    status: number;

    /** 扩展字段 1 */
    is_importance_show: string;

    /** 扩展字段 2 */
    name_show: string;

    /** 扩展字段 3 */
    status_show: string;
  } | null;

  /**
   *  销售合同信息
   */
  sales_contract: {
    /** 主键id */
    id: number;

    /** 名称 */
    name: string;

    /** 编号 */
    code: string;

    /** 结算方式 */
    settle_type: string;

    /** 状态 */
    status: string;

    /** 甲方结算人员 */
    settle_client_contact_id: number;

    /** 乙方结算人员 */
    settle_staff_id: number;

    /** 扩展字段 1 */
    status_show: string;

    /**
     *  settleClientContact
     */
    settle_client_contact: {
      /** 主键id */
      id: number;

      /** 名称 */
      name: string;
    } | null;

    /**
     *  settleStaff
     */
    settle_staff: {
      /** 主键id */
      id: number;

      /** 用户名 */
      name: string;

      /** 扩展字段 1 */
      avatar_path: string;
    } | null;
  } | null;

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


type SalesOrderMaterialSku = {
  id: number;
  company_id: number;
  material_id: number;
  name: string;
  code: string;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  material_sku: BlockMaterialSku | null;
  material: BlockMaterail;
  picture_path?: string;
  attr_snapshoot: AttrSnapshoot;
};

/** 新增子合同需求单后返回的数据 */
type SalesOrderAddResponse = Pick<
  SalesOrder,
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
