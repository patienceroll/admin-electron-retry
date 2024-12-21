import fetch from "src/util/fetch";

export const projectTypeMap = new Map<ProjectStatus, EnumValue<ProjectStatus>>([
  [1, { value: 1, color: "blue", text: "施工单位" }],
  [2, { value: 2, color: "#cfc922", text: "业主单位" }],
  [3, { value: 3, color: "green", text: "设计院" }],
  [4, { value: 4, color: "rgba(0, 0, 0, 0.25)", text: "其他单位" }],
]);

/**
 * 项目-列表
 */
export function getProjectList(params: ListParam & {}) {
  return fetch.GET<List<Project>>(fetch.base(`/api/project/list`), params);
}

/**
 * 项目-选项
 */
export function getProjectOption(params: {}) {
  return fetch.GET<Project[]>(fetch.base(`/api/project/list`), params);
}

/**
 * 项目-详情
 */
export function getProject(params: Pick<SalesContract, "id">) {
  return fetch.GET<Project>(fetch.base(`/api/project/detail`), params);
}

/**
 * 项目-添加
 */
export function addProject(params: any) {
  return fetch.POST<
    Pick<
      Project,
      | "company_id"
      | "name"
      | "code"
      | "status"
      | "created_id"
      | "created_at"
      | "updated_at"
      | "id"
      | "status_show"
    >
  >(fetch.base(`/api/project`), params);
}

/**
 * 项目-编辑
 */
export function editProject(params: any) {
  return fetch.PUT(fetch.base(`/api/project`), params);
}

/**
 * 项目-删除
 */
export function deleteProject(params: Pick<Project, "id">) {
  return fetch.DELETE(fetch.base(`/api/project`), params);
}

/** 项目概况 */
export function getProjectStatistics() {
  return fetch.GET<
    {
      status: number;
      status_show: string;
      num: number;
    }[]
  >(fetch.base(`/api/project/statistics`));
}

/**
 * 生成合同编号 */
export const getProjectCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/project/code")
  );
};

/**
 * 项目单位-添加
 */
export function addProjectUnit(params: any) {
  return fetch.POST<ProjectUnitAddResponse>(
    fetch.base(`/api/project-unit`),
    params
  );
}

/**
 * 项目单位-修改
 */
export function editProjectUnit(params: any) {
  return fetch.PUT(fetch.base(`/api/project-unit`), params);
}
/**
 * 项目单位-列表
 */
export function getProjectUnitList(
  params: ListParam & {
    id: Project["id"];
  }
) {
  return fetch.GET<List<ProjectUnit>>(
    fetch.base(`/api/project-unit/list`),
    params
  );
}

/**
 * 项目单位-删除
 */
export function deleteProjectUnit(params: Pick<ProjectUnit, "id">) {
  return fetch.DELETE(fetch.base(`/api/project-unit`), params);
}

/** 项目(业务机会) - 移交 */
export function move(params: { ids: Project["id"][]; staff_id: Staff["id"] }) {
  return fetch.POST(fetch.base(`/api/project/move`), params);
}

/** 项目(业务机会)-审批 */
export function approval(params: {
  id: Project["id"];
  result: 1 | 2;
  remark: string;
  file_ids: FileResponse["id"][];
}) {
  return fetch.POST(fetch.base(`/api/project/approval`), params);
}

/** 项目(业务机会)-提交审批 */
export function startApproval(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/start-approval`), params);
}

/** 项目(业务机会)-取消 */
export function cancel(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/cancel`), params);
}

/** 项目-审批记录 */
export function getApprovalRecord(params: Pick<Project, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/project/approval-record`),
    params
  );
}

/** 项目-中止 */
export function billSuspend(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/suspend`), params);
}

/** 项目-取消中止 */
export function cancelBillSuspend(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/cancel-suspend`), params);
}

/** 项目-完结 */
export function billEnd(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/end`), params);
}

/** 项目-取消完结 */
export function cancelBillEnd(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/cancel-end`), params);
}

/** 项目-作废 */
export function billInvalid(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/invalid`), params);
}

/** 项目-撤销 */
export function cancelOperate(params: Pick<Project, "id">) {
  return fetch.POST(fetch.base(`/api/project/cancel-operate`), params);
}

/** 项目-导出 */
export function projectExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/project/export`), params);
}

/** 项目 操作记录 */
export function getOperateRecord(params: Pick<Project, "id">) {
  return fetch.GET<OperateRecord[]>(fetch.base(`/api/project/log`), params);
}
