import fetch from "src/util/fetch";

export const projectFollowStatus = new Map<
  ProjectFollowListItem["status"],
  EnumValue<ProjectFollowListItem["status"]>
>([
  [0, { value: 0, color: "rgb(156,156,148)", text: "已取消" }],
  [1, { value: 1, color: "rgb(64,124,72)", text: "草稿" }],
  [2, { value: 2, color: "#4ff7cf", text: "待跟进" }],
  [3, { value: 3, color: "#52c41a", text: "跟进中" }],
  [4, { value: 4, color: "#001529", text: "已跟进" }],
  [5, { value: 5, color: "#1677ff", text: "已点评" }],
]);

/**
 * 项目跟进-列表
 */
export function getProjectFollowList(
  params: ListParam & {
    project_id?: Project["id"];
    business_opportunity_id?: BusinessOpportunity["id"];
  }
) {
  return fetch.GET<List<ProjectFollowListItem>>(
    fetch.base(`/api/project-follow/list`),
    params
  );
}
/**
 * 项目跟进-选项
 */
export function getProjectFollowOption(
  params: ListParam & {
    project_id?: Project["id"];
    business_opportunity_id?: BusinessOpportunity["id"];
  }
) {
  return fetch.GET<ProjectFollowListItem[]>(
    fetch.base(`/api/project-follow/list`),
    params
  );
}

/**
 * 项目跟进-详情
 */
export function getProjectFollow(params: Pick<ProjectFollowListItem, "id">) {
  return fetch.GET<ProjectFollowListItem>(
    fetch.base(`/api/project-follow/detail`),
    params
  );
}

/**
 * 项目跟进-添加
 */
export function addProjectFollow(params: any) {
  return fetch.POST(fetch.base(`/api/project-follow`), params);
}

/**
 * 项目跟进-编辑
 */
export function editProjectFollow(params: any) {
  return fetch.PUT(fetch.base(`/api/project-follow`), params);
}

/**
 * 项目跟进-删除
 */
export function deleteProjectFollow(params: Pick<ProjectFollowListItem, "id">) {
  return fetch.DELETE(fetch.base(`/api/project-follow`), params);
}

/** 项目(业务机会)-审批 */
export function approval(params: {
  id: ProjectFollowListItem["id"];
  result: 1 | 2;
  remark: string;
  file_ids: FileResponse["id"][];
}) {
  return fetch.POST(fetch.base(`/api/project-follow/approval`), params);
}

/** 项目(业务机会)-提交审批 */
export function startApproval(params: Pick<ProjectFollowListItem, "id">) {
  return fetch.POST(fetch.base(`/api/project-follow/start-approval`), params);
}

/** 项目(业务机会)-取消 */
export function cancel(params: Pick<ProjectFollowListItem, "id">) {
  return fetch.POST(fetch.base(`/api/project-follow/cancel`), params);
}

/** 跟进-开始 PC暂不开通此功能 */
// export function startFollow(params: Pick<ProjectFollow, 'id'>) {
//   return fetch.POST(fetch.base(`/api/project-follow/start`), params);
// }

/** 跟进-保存过程信息 */
export function saveFollowProcess(
  params: Pick<
    ProjectFollowListItem,
    "id" | "start_time" | "result" | "problem"
  > & {}
) {
  return fetch.POST(fetch.base(`/api/project-follow/save_process`), params);
}

/** 跟进-结束 */
export function finishFollow(params: Pick<ProjectFollowListItem, "id">) {
  return fetch.POST(fetch.base(`/api/project-follow/finish`), params);
}

/** 跟进-点评 */
export function evaluateFollow(
  params: Pick<ProjectFollowListItem, "id" | "evaluate" | "score"> & {}
) {
  return fetch.POST(fetch.base(`/api/project-follow/evaluate`), params);
}
/** 项目跟进-审批记录 */
export function getApprovalRecord(params: Pick<ProjectFollowListItem, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/project-follow/approval-record`),
    params
  );
}

/** 项目跟进-批量跟进 */
export function projectFollowBatchFollow(params: {
  data: {
    content: string;
    id?: number;
    plan_start_time: string;
    plan_finish_time: string;
    remark: string;
    staff_id: number;
    table_id: number;
  }[];
  /** 1机会2项目3客户 */
  type: 1 | 2 | 3;
}) {
  return fetch.POST(
    fetch.base(`/api/project-follow/batch-start-approval`),
    params
  );
}

/** 项目跟进-操作记录 */
export function getOperateRecord(params: Pick<ProjectFollowListItem, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/project-follow/log`),
    params
  );
}
