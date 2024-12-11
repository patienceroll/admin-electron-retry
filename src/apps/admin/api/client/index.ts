import fetch from "src/util/fetch";

export const StaffStatus = new Map<
  StaffListItem["status"],
  EnumValue<StaffListItem["status"]>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

/**
 * 客户联系人-列表
 */
export function getClientContactDetailList(
  params: ListParam & {
    client_id?: ClientListItem["id"];
  }
) {
  return fetch.GET<List<ClientListItem>>(
    fetch.base(`/api/client-contact/list`),
    params
  );
}

/**
 * 客户-列表
 */
export function getClientList(
  params: ListParam & {
    is_sign?: ClientListItem["is_sign"];
    project_id?: Project["id"];
    business_opportunity_id?: BusinessOpportunity["id"];
  }
) {
  return fetch.GET<List<ClientListItem>>(
    fetch.base(`/api/client/list`),
    params
  );
}

/** 客户选项 */
export function getClientOption(params: {
  is_sign?: ClientListItem["is_sign"];
  project_id?: Project["id"];
  business_opportunity_id?: BusinessOpportunity["id"];
}) {
  return fetch.GET<ClientListItem[]>(fetch.base(`/api/client/list`), params);
}

/**
 * 客户-详情
 */
export function getClient(params: Pick<ClientListItem, "id">) {
  return fetch.GET<ClientListItem>(fetch.base(`/api/client/detail`), params);
}

/**
 * 客户-添加
 */
export function addClient(
  params: Partial<
    Pick<
      ClientListItem,
      "name" | "short_name" | "type" | "nature" | "address" | "is_sign"
    >
  > &
    AddresssParams & { project_id?: Project["id"] }
) {
  return fetch.POST<ClientAddResponse>(fetch.base(`/api/client`), params);
}

/**
 * 客户-编辑
 */
export function editClient(params: any) {
  return fetch.PUT(fetch.base(`/api/client`), params);
}

/**
 * 客户-删除
 */
export function deleteClient(params: Pick<ClientListItem, "id">) {
  return fetch.DELETE(fetch.base(`/api/client`), params);
}

/** 客户-导出 */
export function clientExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/client/export`), params);
}
