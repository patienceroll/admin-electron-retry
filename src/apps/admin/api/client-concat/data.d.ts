type ClientContact = {
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

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

  /** 级别 */
  grade: number;

  /** 爱好 */
  hobbies: string;

  /** 重要联系人;0:否,1:是 */
  is_main: number;

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
};
