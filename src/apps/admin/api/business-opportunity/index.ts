import fetch from "src/util/fetch";

export const BusinessOpportunityStatus = new Map<
  BusinessOpportunity["status"],
  EnumValue<BusinessOpportunity["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#cfc922", text: "机会" }],
  [2, { value: 2, color: "#6a8fc3", text: "已立项" }],
  [3, { value: 3, color: "#4ff7cf", text: "已成交" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 项目-列表
 * */
export function getBusinessOpportunityList(
  params: ListParam & { status?: BusinessOpportunity["status"] }
) {
  return fetch.GET<List<BusinessOpportunity>>(
    fetch.base(`/api/business-opportunity/list`),
    params
  );
}

/**
 * 项目-列表
 * */
export function getBusinessOpportunityNoPage(params: { ids?: number[] }) {
  return fetch.GET<BusinessOpportunity[]>(
    fetch.base(`/api/business-opportunity/list`),
    params
  );
}

/**
 * 项目-详情
 * */
export function getBusinessOpportunity(params: Pick<SalesContract, "id">) {
  return fetch.GET<BusinessOpportunity>(
    fetch.base(`/api/business-opportunity/detail`),
    params
  );
}

/** 获取当前系统项目拥有的状态字段 */
export function getProjectStatusText() {
  return fetch.GET<string[]>(
    fetch.base(`/api/business-opportunity/project-status`)
  );
}

/**
 * 项目-添加
 * */
export function addBusinessOpportunity(params: any) {
  return fetch.POST<BusinessOpportunityAddResponse>(
    fetch.base(`/api/business-opportunity`),
    params
  );
}

/**
 * 项目-编辑
 * */
export function editBusinessOpportunity(params: any) {
  return fetch.PUT(fetch.base(`/api/business-opportunity`), params);
}

/**
 * 项目-删除
 * */
export function deleteBusinessOpportunity(
  params: Pick<BusinessOpportunity, "id">
) {
  return fetch.DELETE(fetch.base(`/api/business-opportunity`), params);
}

/** 项目概况 */
export function getBusinessOpportunityStatistics(params: {
  company_id: Company["id"];
}) {
  return fetch.GET<
    {
      status: number;
      status_show: string;
      num: number;
    }[]
  >(fetch.base(`/api/business-opportunity/statistics`), params);
}

/** 项目(业务机会) - 移交 */
export function move(params: {
  ids: BusinessOpportunity["id"][];
  staff_id: Staff["id"];
}) {
  return fetch.POST(fetch.base(`/api/business-opportunity/move`), params);
}

/** 项目(业务机会)-审批 */
export function approval(params: {
  id: BusinessOpportunity["id"];
  result: 1 | 2;
  remark: string;
  file_ids: FileResponse["id"][];
}) {
  return fetch.POST(fetch.base(`/api/business-opportunity/approval`), params);
}

/** 项目(业务机会)-提交审批 */
export function startApproval(params: Pick<BusinessOpportunity, "id">) {
  return fetch.POST(
    fetch.base(`/api/business-opportunity/start-approval`),
    params
  );
}

/** 项目(业务机会)-立项 */
export function businessOpportunitySetup(
  params: Pick<BusinessOpportunity, "id">
) {
  return fetch.POST(fetch.base(`/api/business-opportunity/enable`), params);
}

/** 项目(业务机会)-取消 */
export function cancel(params: Pick<BusinessOpportunity, "id">) {
  return fetch.POST(fetch.base(`/api/business-opportunity/cancel`), params);
}

/** 项目-审批记录 */
export function getApprovalRecord(params: Pick<BusinessOpportunity, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/business-opportunity/approval-record`),
    params
  );
}

/** 业务机会-作废 */
export function billInvalid(params: Pick<BusinessOpportunity, "id">) {
  return fetch.POST(fetch.base(`/api/business-opportunity/invalid`), params);
}

/** 业务机会-撤销 */
export function cancelOperate(params: Pick<BusinessOpportunity, "id">) {
  return fetch.POST(
    fetch.base(`/api/business-opportunity/cancel-operate`),
    params
  );
}

/** 业务机会-导出 */
export function businessOpportunityExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/business-opportunity/export`), params);
}
/** 业务机会 操作记录 */
export function getOperateRecord(params: Pick<BusinessOpportunity, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/business-opportunity/log`),
    params
  );
}
