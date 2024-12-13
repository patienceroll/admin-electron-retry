import fetch from "src/util/fetch";

/**
 * 客户联系人-列表
 */
export function getClientContactList(
  params: ListParam & {
    client_id?: ClientListItem["id"];
  }
) {
  return fetch.GET<List<ClientContaListItem>>(
    fetch.base(`/api/client-contact/list`),
    params
  );
}
/**
 * 客户联系人-选项
 */
export function getClientContactOptions(
  params: ListParam & {
    client_id?: ClientListItem["id"];
  }
) {
  return fetch.GET<ClientContaListItem[]>(
    fetch.base(`/api/client-contact/list`),
    params
  );
}

/**
 * 客户联系人-详情
 */
export function getClientContact(params: Pick<ClientContaListItem, "id">) {
  return fetch.GET(fetch.base(`/api/client-contact/detail`), params);
}

/**
 * 客户联系人-添加
 */
export function addClientContact(
  params: Pick<
    ClientContaListItem,
    | "ID_card"
    | "name"
    | "short_name"
    | "type"
    | "nature"
    | "address"
    | "is_sign"
    | "status"
    | "company_id"
    | "client_id"
  >
) {
  return fetch.POST(fetch.base(`/api/client-contact`), params);
}

/**
 * 客户联系人-编辑
 */
export function editClientContact(params: any) {
  return fetch.PUT(fetch.base(`/api/client-contact`), params);
}

/**
 * 客户联系人-删除
 */
export function deleteClientContact(params: Pick<ClientContaListItem, "id">) {
  return fetch.DELETE(fetch.base(`/api/client-contact`), params);
}

/** 客户联系人-导出 */
export function clientContactExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/client-contact/export`), params);
}
