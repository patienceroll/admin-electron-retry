type SalesContract = {
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

  /** 客户id */
  client_id: number;

  /** 项目id */
  project_id: number;

  /** 类型;1:主合同,2:补充协议 */
  type: number;

  /** 主合同id */
  pid: number;

  /** 名称 */
  name: string;

  /** 编号 */
  code: string;

  /** 税率 */
  tax_rate: number;

  /** 金额 */
  amount: number;

  /** 签约日期 */
  sign_date: number;

  /** 签约地点 */
  sign_address: string;

  /** 负责人id */
  staff_id: number;

  /** 签约人id */
  sign_staff_id: number;

  /** 乙方结算人员 */
  settle_staff_id: number;

  /** 甲方负责人 */
  client_contact_id: number;

  /** 甲方结算人员 */
  settle_client_contact_id: number;

  /** 结算方式 */
  settle_type: string;

  /** 付款方式;1:先货后款,2:先款后货 */
  payment_type: number;

  /** 预付款比例 */
  advance_ratio: number;

  /** 质保金比例 */
  quality_ratio: number;

  /** 账户余额 */
  balance_amount: number;

  /** 收款账户id */
  collect_bank_account_id: number;

  /** 开票账户id */
  invoice_bank_account_id: number;

  /** 备注 */
  remark: string;

  /** 厂家配送;0:否,1:是 */
  is_factory_dispatch: number;

  /** 是否审批中;0:否,1:是 */
  is_approve: number;

  /** 状态 */
  status: number;

  /** 创建者id */
  created_id: number;

  /** 删除时间 */
  deleted_at: string;

  /** 更新时间 */
  updated_at: string;

  /** 创建时间 */
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
   *  员工信息
   */
  staff: {
    /** 主键id */
    id: number;

    /** 用户id */
    user_id: number;

    /** 用户名 */
    name: string;

    /** 工号 */
    code: string;

    /** 手机号 */
    phone: string;

    /** 照片 */
    avatar: string;

    /** 身份证号 */
    ID_card: string;

    /** 微信号 */
    wechat: string;

    /** 扩展字段 1 */
    avatar_path: string;
  } | null;

  /**
   *  项目信息
   */
  project: {
    /** 主键id */
    id: number;

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
   *  明细信息
   */
  detail:
    | {
        /** 主键id */
        id: number;

        /** 销售合同id */
        sales_contract_id: number;

        /** 产品ID */
        material_id: string;

        /** 物料SKU */
        material_sku_id: string;

        /** 属性快照 */
        attr_snapshoot: Record<string, string>;

        /** 数量 */
        num: number;

        /** 单位 */
        unit: string;

        /** 价格 */
        price: number;

        /** 金额 */
        amount: number;

        /** 备注 */
        remark: string;

        /**
         *  物料信息
         */
        material: {
          /** ID */
          id: string;

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

          /** 扩展字段 1 */
          picture_path: string;

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
          } | null;
        } | null;

        /**
         *  物料属性信息
         */
        material_sku: {
          /** 主键id */
          id: number;

          /** 名称 */
          name: string;

          /** 编号 */
          code: string;

          /** 属性明细快照 */
          attr_snapshoot: Record<string, string>;

          /** 图片 */
          picture: string;

          /** 外径 */
          o_diameter: number;

          /** 壁厚 */
          wall_thickness: number;

          /** 内涂层厚度 */
          i_coat_thickness: string;

          /** 外涂层厚度 */
          o_coat_thickness: string;

          /** 长度 */
          length: number;

          /** 连接方式 */
          connection_type: string;

          /** 钢卷类型 */
          steel_type: string;

          /** 材质 */
          texture: string;

          /** 内涂层颜色 */
          i_coat_color: string;

          /** 外涂层颜色 */
          o_coat_color: string;

          /** 扩展字段 1 */
          picture_path: string;
        } | null;

        /**
         *  组合单位信息
         */
        line_unit:
          | {
              /** 主键id */
              id: number;

              /** 表 */
              table: string;

              /** 表id */
              table_id: number;

              /** 类型 */
              type: number;

              /** 物料单位id */
              material_unit_id: number;

              /** 数量 */
              num: number;

              /** 价格 */
              price: number;

              /** 单位 */
              unit: string;

              /** 单位别名 */
              alias: string;

              /** 是否执行单位;0:否,1:是 */
              is_execute: number;
            }[]
          | null;
      }[]
    | null;
};

type SalesContractMaterialSku = {
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
  material: Materail;
  picture?: string;
  picture_path?: string;
};

/** 新增销售合同后返回的数据 */
type SalesContractAddResponse = Pick<
  SalesContract,
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
