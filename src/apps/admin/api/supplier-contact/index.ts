import fetch from "src/util/fetch";

export const SupplierContactStatus = new Map<
  SupplierContact["status"],
  EnumValue<SupplierContact["status"]>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);


/**
 * 供应商联系人-列表
 */
export function getSupplierContactList(params: ListParam) {
  return fetch.GET<List<SupplierContact>>(
    fetch.base(`/api/supplier-contact/list`),
    params
  );
}

/**
 * 供应商联系人-详情
 */
export function getSupplierContact(params: Pick<SupplierContact, "id">) {
  return fetch.GET<SupplierContact>(
    fetch.base(`/api/supplier-contact/detail`),
    params
  );
}

/**
 * 供应商联系人-添加
 */
export function addSupplierContact(params: any) {
  return fetch.POST(fetch.base(`/api/supplier-contact`), params);
}

/**
 * 供应商联系人-编辑
 */
export function editSupplierContact(params: any) {
  return fetch.PUT(fetch.base(`/api/supplier-contact`), params);
}

/**
 * 供应商联系人-删除
 */
export function deleteSupplierContact(params: Pick<SupplierContact, "id">) {
  return fetch.DELETE(fetch.base(`/api/supplier-contact`), params);
}

/** 供应商联系人-导出 */
export function supplierContactExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/supplier-contact/export`), params);
}
