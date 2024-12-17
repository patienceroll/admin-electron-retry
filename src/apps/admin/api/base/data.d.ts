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
  