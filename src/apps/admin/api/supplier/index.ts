import fetch from "src/util/fetch";

export const SupplierStatus = new Map<
  Supplier["status"],
  EnumValue<Supplier["status"]>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 供应商-列表
 */
export function getSupplierList(params: ListParam) {
  return fetch.GET<List<Supplier>>(fetch.base(`/api/supplier/list`), params);
}
export function getSupplierOption(params: {}) {
  return fetch.GET<Supplier[]>(fetch.base(`/api/supplier/list`), params);
}

/**
 * 供应商-详情
 */
export function getSupplier(params: Pick<Supplier, "id">) {
  return fetch.GET<Supplier>(fetch.base(`/api/supplier/detail`), params);
}

/**
 * 供应商-添加
 */
export function addSupplier(params: any) {
  return fetch.POST<
    Pick<
      Supplier,
      | "name"
      | "short_name"
      | "address"
      | "remark"
      | "status"
      | "company_id"
      | "id"
      | "name_show"
    >
  >(fetch.base(`/api/supplier`), params);
}

/**
 * 供应商-编辑
 */
export function editSupplier(params: any) {
  return fetch.PUT(fetch.base(`/api/supplier`), params);
}

/**
 * 供应商-删除
 */
export function deleteSupplier(params: Pick<Supplier, "id">) {
  return fetch.DELETE(fetch.base(`/api/supplier`), params);
}
/** 供应商-导出 */
export function supplierExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/supplier/export`), params);
}
