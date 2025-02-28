type Approval = {
  /** 主键id */
  id: number;

  /** 公司id */
  company_id: number;

  /** 目标表 */
  table: string;

  /** 名称 */
  name: string;

  /** 编号 */
  code: string;

  /** 发起人职位 */
  job_id: number;

  /** 状态 */
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

  /**  */
  table_show: string;

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
   *  job
   */
  job: {
    /** 主键id */
    id: number;

    /** 职位名称 */
    name: string;
  } | null;

  /**
   *  note
   */
  note?:
    | {
        /** 主键id */
        id: number;

        /** 审批id */
        approval_id: number;

        /** 层级 */
        level: number;

        /** 员工id */
        staff_id: number;

        /** 状态;0:停用,1:有效 */
        status: number;

        /**
         *  员工信息
         */
        staff: {
          /** 主键id */
          id: number;

          /** 部门id */
          department_id: number;

          /** 职位id */
          job_id: number;

          /** 用户名 */
          name: string;

          /** 工号 */
          code: string;

          /** 手机号 */
          phone: string;

          /** 照片 */
          avatar: string;

          /** 状态;0:离职,1:试用,2:转正 */
          status: number;

          /** 扩展字段 1 */
          avatar_path: string;

          /**
           *  job
           */
          job: {
            /** 主键id */
            id: number;

            /** 职位名称 */
            name: string;
          };
        };
      }[];
};
