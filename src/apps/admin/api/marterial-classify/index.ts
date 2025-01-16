import fetch from "src/util/fetch";

/** 物料分类 树 */
export function materialClassifyTree() {
  return fetch.GET<MaterialClassifyTree[]>(
    fetch.base(`/api/material-classify/tree`)
  );
}

/**
 * 物资分类-新增
 */
export const postMaterialClassify = (
  data: Pick<MaterialClassify, "code" | "pid" | "name" | "status"> & {
    attr_ids: MaterialAttr["id"][];
  }
) => {
  return fetch.POST(fetch.base("/api/material-classify"), data);
};

/**
 * 物资分类-编辑
 */
export const putMaterialClassify = (
  data: Pick<MaterialClassify, "id" | "code" | "name" | "status">
) => {
  return fetch.PUT(fetch.base("/api/material-classify"), data);
};

/**
 * 物资分类-列表
 */
export const getMaterialClassifyList = (params: ListParam & {}) => {
  return fetch.GET<List<MaterialClassify>>(
    fetch.base("/api/material-classify/list"),
    params
  );
};
/**
 * 物资分类-列表
 */
export const getMaterialClassifyOptions = (params: ListParam & {}) => {
  return fetch.GET<MaterialClassify[]>(
    fetch.base("/api/material-classify/list"),
    params
  );
};

/**
 * 物资分类-删除
 */
export const deleteMaterialClassify = (data: Pick<MaterialClassify, "id">) => {
  return fetch.DELETE(fetch.base("/api/material-classify"), data);
};

/**
 * 物资分类-列表-详情
 */
export const getMaterialClassify = (params: Pick<MaterialClassify, "id">) => {
  return fetch.GET<MaterialClassify>(
    fetch.base("/api/material-classify/detail"),
    params
  );
};
