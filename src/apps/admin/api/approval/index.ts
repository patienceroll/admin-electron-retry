import fetch from "src/util/fetch";
/**
 * 审批管理-配置 */
export const getApprovalConfig = () => {
  return fetch.GET<List<Approval>>(fetch.base("/api/approval/config"));
};

/** 审批管理-选项 */
export const getApprovalOptions = () => {
  return fetch.GET<Approval[]>(fetch.base("/api/approval/config"));
};

export const getApprovalName = () => {
  return fetch.GET<string[]>(fetch.base("/api/approval/name"));
};

/**
 * 审批管理-新增
 */
export const addApproval = (
  data: Pick<Approval, "company_id" | "name" | "code"> & {
    staff_ids: Staff["id"][];
  },
) => {
  return fetch.POST(fetch.base("/api/approval"), data);
};

/**
 * 审批管理-编辑
 */
export const editApproval = (
  data: Pick<Approval, "company_id" | "name" | "code" | "id"> & {
    staff_ids: Staff["id"][];
  },
) => {
  return fetch.PUT(fetch.base("/api/approval"), data);
};

/**
 * 审批管理-列表
 */
export const getApprovals = (data: ListParam) => {
  return fetch.GET<List<Approval>>(fetch.base("/api/approval/list"), data);
};

/**
 * 审批管理-删除
 */
export const deleteApproval = (data: Pick<Approval, "id">) => {
  return fetch.DELETE(fetch.base("/api/approval"), data);
};

/**
 * 审批管理-列表-详情
 */
export const getApproval = (params: Pick<Approval, "id">) => {
  return fetch.GET<Approval>(fetch.base("/api/approval/detail"), params);
};
