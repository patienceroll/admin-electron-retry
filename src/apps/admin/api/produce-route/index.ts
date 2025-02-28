import fetch from "src/util/fetch";
/**
 * 工艺路线-新增
 */
export const postProduceRoute = (
  data: Pick<ProduceRoute, "company_id" | "name" | "code" | "status"> & {
    process_ids: ApprovalProcess["id"][];
  },
) => {
  return fetch.POST(fetch.base("/api/produce-route"), data);
};

/**
 * 工艺路线-编辑
 */
export const putProduceRoute = (
  data: Pick<ProduceRoute, "company_id" | "name" | "code" | "status" | "id"> & {
    process_ids: ApprovalProcess["id"][];
  },
) => {
  return fetch.PUT(fetch.base("/api/produce-route"), data);
};

/**
 * 工艺路线-列表
 */
export const getProduceRoutes = (params: ListParam) => {
  return fetch.GET<List<ProduceRoute>>(
    fetch.base("/api/produce-route/list"),
    params,
  );
};
/**
 * 工艺路线-列表-详情
 */
export const getProduceRoute = (params: Pick<ProduceRoute, "id">) => {
  return fetch.GET<ProduceRoute>(
    fetch.base("/api/produce-route/detail"),
    params,
  );
};
/**
 * 工艺路线-删除
 */
export const deleteProduceRoute = (data: Pick<ProduceRoute, "id">) => {
  return fetch.DELETE(fetch.base("/api/produce-route"), data);
};
