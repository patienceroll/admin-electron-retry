type OperateRecord = {
  action: string;
  company_id: number;
  created_at: string;
  created_id: number;
  created_user: BlockCreateUser;
  detail: string[];
  id: number;
  remark: string;
  table: string;
  table_id: number;
  tag: string;
};

type ApprovalRecord = {
  approval: { code: string; id: number; name: string } | null;
  approval_id: number;
  company_id: number;
  created_at: string;
  created_id: number;
  deleted_at: string;
  id: number;
  record: ApprovalRecordItem[];
  remark: string;
  /** 0待审批，1审批中，2已通过，3未通过 */
  status: 0 | 1 | 2 | 3;
  status_show: string;
  table: string;
  table_id: number;
  updated_at: string;
};

/** 审批数据单项 */
type ApprovalRecordItem = {
  approval_id: number;
  approval_note_id: number;
  company_id: number;
  created_at: string;
  created_id: number;
  deleted_at: string;
  file: {
    extend: { file_size: number; file_type: string };
    full_path: string;
    id: number;
    laravel_through_key: number;
    name: string;
    path: string;
    a: FileResponse;
  }[];
  happen_time: string;
  id: number;
  level: number;
  remark: string;
  staff: BlockStaff;
  staff_id: number;
  /** ,0:发起,1:未审批,2:待审批,3:已通过,4:未通过,5:无效,6:撤销 */
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  status_show: string;
  table: string;
  table_id: number;
  updated_at: string;
  user_id: number;
};
