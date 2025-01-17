import fetch from "src/util/fetch";
/**
 * 物资-新增
 */
export const postMaterial = (
  data: Pick<
    Material,
    | "material_classify_id"
    | "name"
    | "code"
    | "brand"
    | "model"
    | "unit"
    | "status"
  >
) => {
  return fetch.POST<
    Pick<
      Material,
      | "material_classify_id"
      | "name"
      | "code"
      | "brand"
      | "model"
      | "status"
      | "id"
    >
  >(fetch.base("/api/material"), data);
};

/**
 * 物资-编辑
 */
export const putMaterial = (
  data: Pick<
    Material,
    | "id"
    | "material_classify_id"
    | "name"
    | "code"
    | "brand"
    | "model"
    | "unit"
    | "status"
  >
) => {
  return fetch.PUT(fetch.base("/api/material"), data);
};

/**
 * 物资-列表
 */
export const getMaterialList = (
  params: ListParam & { material_classify_id?: MaterialClassify["id"] }
) => {
  return fetch.GET<List<Material>>(fetch.base("/api/material/list"), params);
};

/**
 * 物资-选项 */
export const getMaterialOption = (params: {
  material_classify_id?: MaterialClassify["id"];
}) => {
  return fetch.GET<Material[]>(fetch.base("/api/material/list"), params);
};

/**
 * 物资-列表-详情
 */
export const getMaterial = (params: Pick<Material, "id">) => {
  return fetch.GET<Material>(fetch.base("/api/material/detail"), params);
};
/**
 * 物资-删除
 */
export const deleteMaterial = (data: Pick<Material, "id">) => {
  return fetch.DELETE(fetch.base("/api/material"), data);
};

/**
 * 物资-属性列表
 */
export const getMaterialsAttrList = (params: {
  material_classify_id: MaterialClassify["id"];
  // material_id: Materail['id'];
  material_sku_id?: number;
}) => {
  return fetch.GET<MaterialOfAttr[]>(fetch.base("/api/material/attr"), params);
};

/**
 * 物资-生成sku
 */
export const postMaterialsAttrSkues = (
  params: Pick<Material, "id"> & {
    attr: MaterialOfAttr[];
  }
) => {
  return fetch.POST(fetch.base("/api/material/attr"), params);
};

/** 物资 - 获取当前物资的sku */
export function getMaterialSkues(
  params: {
    status?: "0" | "1";
    material_id: Material["id"];
    attr_ids?: MaterialOfAttr["detail"][number]["id"][];
  } & ListParam
) {
  return fetch.GET<List<MaterialSku>>(
    fetch.base(`/api/material-sku/list`),
    params
  );
}

/** 物资 - 删除当前物资的sku */
export function deleteMaterialSku(params: { id: MaterialSku["id"] }) {
  return fetch.DELETE(fetch.base(`/api/material-sku`), params);
}

/** 物资 - sku 启用停用 */
export function materialSkuStatus(params: {
  id: MaterialSku["id"];
  status: MaterialSku["status"];
}) {
  return fetch.POST(fetch.base(`/api/material-sku/change-status`), params);
}

/** 物资-导出 */
export function materialExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/material/export`), params);
}

/**
 * 物资-单位设置
 */
export const postMaterialsUnit = (
  params: Pick<Material, "id"> & {
    units: Pick<Material["units"][number], "unit" | "alias" | "is_main">[];
  }
) => {
  return fetch.POST(fetch.base("/api/material/unit"), params);
};

/** 物资 排序 */
export function materialSort(params: {
  data: { id: MaterialAttr["id"]; list: number }[];
}) {
  return fetch.POST(fetch.base(`/api/material-attr/name-list`), params);
}
