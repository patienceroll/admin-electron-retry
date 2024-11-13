import fetch from "src/util/fetch";

/**
 * 公司-列表
 */
export function getCompanyList(params: ListParam) {
  return fetch.GET<List<CompanyListItem>>(fetch.base(`/api/company/list`), params);
}


/**
 * 公司-详情
 */
export function getCompanyDetail(params: Pick<Company, "id">) {
    return fetch.GET<Company>(fetch.base(`/api/company/detail`), params);
  }