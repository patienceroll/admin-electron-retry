import fetch from "src/util/fetch";

/** 属性列表 */
export function getMaterialAttrs() {
  return fetch.GET<MaterialAttr[]>(fetch.base(`/api/material-attr/list`));
}

/** 保存属性 */
export function putMaterialAttrs(params: {
  detail: Pick<MaterialAttr["detail"][number], "value">[];
  id: MaterialAttr["id"];
  name: MaterialAttr["name"];
}) {
  return fetch.PUT(fetch.base(`/api/material-attr`), params);
}
