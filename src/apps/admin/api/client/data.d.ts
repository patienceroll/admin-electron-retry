type Client = {
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

  /** 类型;1:施工单位,2:业主单位,3:设计院,4:其他单位 */
  type: number;

  /** 公司 */
  name: string;

  /** 简称 */
  short_name: string;

  /** 法人 */
  legal_person: string;

  /** 性质 */
  nature: string;

  /** 等级 */
  grade: string;

  /** 规模 */
  scale: string;

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

  /** 注册地址 */
  registration_address: string;

  /** 成立日期 */
  establishment_date: number;

  /** 统一社会信用代码 */
  social_credit_code: string;

  /** 税务登记号 */
  tax_registration_code: string;

  /** 主营产品或服务 */
  main_business: string;

  /** 年营业额 */
  annual_turnover: string;

  /** 电话号码 */
  telephone: string;

  /** 传真号码 */
  fax_number: string;

  /** 邮箱地址 */
  email_address: string;

  /** 官方网站 */
  official_website: string;

  /** 是否签约;0:否,1:是 */
  is_sign: number;

  /** 预存金额 */
  balance_amount: string;

  /** 负责人 */
  staff_id: number;

  /** 信息完善度 */
  perfect_ratio: number;

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
  type_show: string;

  /** 扩展字段 2 */
  is_sign_show: string;

  /** 扩展字段 3 */
  name_show: string;

  /** 扩展字段 4 */
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
  /**
   *  contact
   */
  contact:
    | {
        /** 主键id */
        id: number;

        /** 客户id */
        client_id: number;

        /** 名称 */
        name: string;

        /** 职位 */
        job_title: string;

        /** 手机号 */
        phone: string;

        /** 微信 */
        wechat: string;

        /** 身份证号 */
        ID_card: string;

        /** 重要联系人;0:否,1:是 */
        is_main: number;

        /** 状态;0:停用,1:有效 */
        status: number;
      }[]
    | null;
};
/** 新增客户后返回的数据 */
type ClientAddResponse = Pick<
  Client,
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

type Client = {
  id: number;
  type: ClientType;
  name: string;
  phone: string;
  avatar: string;
};

/** 客户类型
 * 1 施工单位 2 业主单位 3 设计院 4 其他单位 */
type ClientType = 1 | 2 | 3 | 4;
