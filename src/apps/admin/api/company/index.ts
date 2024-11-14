import fetch from "src/util/fetch";

/**
 * 公司-列表
 */
export function getCompanyList(params: ListParam) {
  return fetch.GET<List<CompanyListItem>>(
    fetch.base(`/api/company/list`),
    params
  );
}

/**
 * 公司-详情
 */
export function getCompanyDetail(params: Pick<Company, "id">) {
  return fetch.GET<Company>(fetch.base(`/api/company/detail`), params);
}

/**
 * 公司-添加
 */
export function addCompany(params: any) {
  return fetch.POST(fetch.base(`/api/company`), params);
}

/**
 * 公司-编辑
 */
export function editCompany(params: any) {
  return fetch.PUT(fetch.base(`/api/company`), params);
}

/**
 * 公司-删除
 */
export function deleteCompany(params: Pick<Company, "id">) {
  return fetch.DELETE(fetch.base(`/api/company`), params);
}
