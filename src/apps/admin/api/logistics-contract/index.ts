import fetch from "src/util/fetch";
/**
 * 运输合同-列表
 */
export function getLogisticsContractList(params: ListParam) {
  return fetch.GET<List<LogisticsContract>>(
    fetch.base(`/api/logistics-contract/list`),
    params,
  );
}

/**
 * 运输合同-详情
 */
export function getLogisticsContract(params: Pick<LogisticsContract, "id">) {
  return fetch.GET<LogisticsContract>(
    fetch.base(`/api/logistics-contract/detail`),
    params,
  );
}

/**
 * 运输合同-添加
 */
export function addLogisticsContract(params: any) {
  return fetch.POST(fetch.base(`/api/logistics-contract`), params);
}

/**
 * 运输合同-编辑
 */
export function editLogisticsContract(params: any) {
  return fetch.PUT(fetch.base(`/api/logistics-contract`), params);
}

/**
 * 运输合同-删除
 */
export function deleteLogisticsContract(params: Pick<LogisticsContract, "id">) {
  return fetch.DELETE(fetch.base(`/api/logistics-contract`), params);
}
