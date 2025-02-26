import fetch from "@/utils/fetch";

/**
 * 运输合同-列表
 */
export function getLogisticsContractList(params: BaseListParam) {
  return fetch.get<List<LogisticsContract>>(
    fetch.base(`/api/logistics-contract/list`),
    params,
  );
}

/**
 * 运输合同-详情
 */
export function getLogisticsContract(params: Pick<LogisticsContract, "id">) {
  return fetch.get<LogisticsContract>(
    fetch.base(`/api/logistics-contract/detail`),
    params,
  );
}

/**
 * 运输合同-添加
 */
export function addLogisticsContract(params: any) {
  return fetch.post(fetch.base(`/api/logistics-contract`), params);
}

/**
 * 运输合同-编辑
 */
export function editLogisticsContract(params: any) {
  return fetch.put(fetch.base(`/api/logistics-contract`), params);
}

/**
 * 运输合同-删除
 */
export function deleteLogisticsContract(params: Pick<LogisticsContract, "id">) {
  return fetch.del(fetch.base(`/api/logistics-contract`), params);
}
