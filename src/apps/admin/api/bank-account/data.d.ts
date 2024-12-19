/** 账户类型
 * 1-公司,2-客户,3-供应商,4-员工 */
type BankAccountType = 1 | 2 | 3 | 4;

type BankAccount = {
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

  /** 类型;1:公司,2:客户,3:供应商,4:员工 */
  type: BankAccountType;

  /** 目标表 */
  table: string;

  /** 目标表id */
  table_id: number;

  /** 公司名称 */
  company_name: string;

  /** 公司地址 */
  company_address: string;

  /** 联系人 */
  linkman: string;

  /** 电话 */
  phone: string;

  /** 银行 */
  bank_name: string;

  /** 开户行 */
  bank_address: string;

  /** 税号 */
  tax_code: string;

  /** 账号 */
  account: string;

  /** 状态;0:停用,1:有效 */
  status: number;

  /** 创建者id */
  created_id: number;

  /** 删除时间 */
  deleted_at: number;

  /** 更新时间 */
  updated_at: number;

  /** 添加时间 */
  created_at: number;

  /** 权限控制
   * is_edit : 0|1;
   * is_delete : 0|1;
   */
  btn_power: { is_edit: 0 | 1; is_delete: 0 | 1 };

  /** 扩展字段 1 */
  type_show: string;

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
};
