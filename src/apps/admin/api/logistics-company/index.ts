import fetch from "src/util/fetch";

export const LogisticsCompanyStatus = new Map<
  LogisticsCompanyListItemStatus,
  EnumValue<LogisticsCompanyListItemStatus>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 运输公司-列表
 */
export function getLogisticsCompanyList(params: ListParam) {
  return fetch.GET<List<LogisticsCompany>>(
    fetch.base(`/api/logistics-company/list`),
    params
  );
}
/**
 * 运输公司-选项
 */
export function getLogisticsCompanyOptions(params: ListParam) {
  return fetch.GET<LogisticsCompany[]>(
    fetch.base(`/api/logistics-company/list`),
    params
  );
}

/**
 * 运输公司-详情
 */
export function getLogisticsCompany(params: Pick<LogisticsCompany, "id">) {
  return fetch.GET<LogisticsCompany>(
    fetch.base(`/api/logistics-company/detail`),
    params
  );
}

/**
 * 运输公司-添加
 */
export function addLogisticsCompany(params: any) {
  return fetch.POST(fetch.base(`/api/logistics-company`), params);
}

/**
 * 运输公司-编辑
 */
export function editLogisticsCompany(params: any) {
  return fetch.PUT(fetch.base(`/api/logistics-company`), params);
}

/**
 * 运输公司-删除
 */
export function deleteLogisticsCompany(params: Pick<LogisticsCompany, "id">) {
  return fetch.DELETE(fetch.base(`/api/logistics-company`), params);
}
