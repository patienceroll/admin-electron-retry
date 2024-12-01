import fetch from "src/util/fetch";
/**
 * 系统日志-列表
 */
export function getOperationLogList(params: ListParam) {
  return fetch.GET<List<OperationLogListItem>>(
    fetch.base(`/api/operation-log/list`),
    params
  );
}
