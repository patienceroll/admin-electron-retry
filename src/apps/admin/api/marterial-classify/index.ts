import fetch from "src/util/fetch";

/** 物料类型 树 */
export function materialClassifyTree() {
  return fetch.GET<MaterialClassifyTree[]>(
    fetch.base(`/api/material-classify/tree`)
  );
}

/**
 * 物资类型-新增
 */
export const postMaterialClassify = (
  data: Pick<MaterialClassify, "company_id" | "code" | "name" | "status">
) => {
  return fetch.POST(fetch.base("/api/material-classify"), data);
};

/**
 * 物资类型-编辑
 */
export const putMaterialClassify = (
  data: Pick<
    MaterialClassify,
    "id" | "pid" | "company_id" | "code" | "name" | "status"
  >
) => {
  return fetch.PUT(fetch.base("/api/material-classify"), data);
};

/**
 * 物资类型-列表
 */
export const getMaterialClassifyList = (params: ListParam & {}) => {
  return fetch.GET<List<MaterialClassify>>(
    fetch.base("/api/material-classify/list"),
    params
  );
};
/**
 * 物资类型-列表
 */
export const getMaterialClassifyOptions = (params: ListParam & {}) => {
  return fetch.GET<MaterialClassify[]>(
    fetch.base("/api/material-classify/list"),
    params
  );
};

/**
 * 物资类型-删除
 */
export const deleteMaterialClassify = (data: Pick<MaterialClassify, "id">) => {
  return fetch.DELETE(fetch.base("/api/material-classify"), data);
};

/**
 * 物资类型-列表-详情
 */
export const getMaterialClassify = (params: Pick<MaterialClassify, "id">) => {
  return fetch.GET<MaterialClassify>(
    fetch.base("/api/material-classify/detail"),
    params
  );
};
