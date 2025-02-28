import fetch from "src/util/fetch";

export const ProcessStatus = new Map<
  Processtatus,
  EnumValue<Processtatus>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 工序管理-新增
 */
export const postApprovalProcess = (
  data: Pick<
    ApprovalProcess,
    "company_id" | "name" | "code" | "remark" | "status"
  >,
) => {
  return fetch.POST(fetch.base("/api/process"), data);
};

/**
 * 工序管理-编辑
 */
export const putApprovalProcess = (
  data: Pick<
    ApprovalProcess,
    "company_id" | "name" | "code" | "remark" | "status" | "id"
  >,
) => {
  return fetch.PUT(fetch.base("/api/process"), data);
};

/**
 * 工序管理-列表
 */
export const getApprovalProcesses = (
  params:ListParam & { keyword?: string; company_id?: Company["id"] },
) => {
  return fetch.GET<List<ApprovalProcess>>(
    fetch.base("/api/process/list"),
    params,
  );
};

/**
 * 工序管理-删除
 */
export const deletApprovalProcess = (data: Pick<ApprovalProcess, "id">) => {
  return fetch.DELETE(fetch.base("/api/process"), data);
};
