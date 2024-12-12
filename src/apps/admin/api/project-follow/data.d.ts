/** 项目跟进状态
 * 0-已取消,1-草稿,2-待跟进,3-跟进中,4-已跟进,5-已点评 */
type ProjectFollowStatus = 0 | 1 | 2 | 3 | 4 | 5;

type ProjectFollowListItem = {
    id: number;
    company_id: number;
    project_id: number;
    staff_id: number;
    lead_staff_id: number;
    plan_start_time: string;
    plan_finish_time: string;
    content: string;
    result: string;
    table_id: number;
    type: number;
    problem: string;
    evaluate: string;
    target_show: string;
    remark: string;
    start_time: string | null;
    finish_time: string | null;
    evaluate_time: string | null;
    is_approve: 0 | 1;
    status: ProjectFollowStatus;
    created_id: number;
    deleted_at: string;
    updated_at: string;
    created_at: string;
    btn_power: BtnPower;
    status_show: string;
    /**
     * 评价分数，1~5
     */
    score: number;
    created_user: User;
    company: Company | null;
    staff: Staff | null;
    lead_staff: Staff | null;
    project: Project | null;
    file: Record<BusinessFileIdentify, BusinessFile[] | undefined>;
  };
  