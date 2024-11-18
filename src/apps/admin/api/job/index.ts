import fetch from "src/util/fetch";


export const JobStatus = new Map<
  JobListItemStatus,
  EnumValue<JobListItemStatus>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 职位-列表
 */
export function getJobList(
  params: ListParam & {
    company_ids?: Company["id"][];
    keyword?: string;
    statuses?: number[];
  },
) {
  return fetch.GET<List<JobListItem>>(fetch.base(`/api/job/list`), params);
}

/**
 * 职位-列表
 */
export function getJobOptions(
  params: ListParam & {
    company_ids?: Company["id"][];
    keyword?: string;
    statuses?: number[];
    department_id?:Department['id']
  },
) {
  return fetch.GET<JobListItem[]>(fetch.base(`/api/job/list`), params);
}

/**
 * 职位-详情
 */
export function getJob(params: Pick<JobListItem, "id">) {
  return fetch.GET<JobListItem>(fetch.base(`/api/job/detail`), params);
}

/**
 * 职位-添加
 */
export function addJob(params: any) {
  return fetch.POST(fetch.base(`/api/job`), params);
}

/**
 * 职位-编辑
 */
export function editJob(params: any) {
  return fetch.PUT(fetch.base(`/api/job`), params);
}

/**
 * 职位-删除
 */
export function deleteJob(params: Pick<JobListItem, "id">) {
  return fetch.DELETE(fetch.base(`/api/job`), params);
}
