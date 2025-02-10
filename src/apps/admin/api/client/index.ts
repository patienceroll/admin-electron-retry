import fetch from "src/util/fetch";

export const ClientStatus = new Map<
  Client["status"],
  EnumValue<Client["status"]>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "草稿" }],
  [1, { value: 1, color: "green", text: "启用" }],
  [2, { value: 2, color: "rgb(156,156,148)", text: "停用" }],
]);

export const clientNature = ["民营企业", "国有企业", "事业单位", "其他单位"];

export const clientTypeMap = new Map<Client["type"], EnumValue<Client["type"]>>(
  [
    [1, { value: 1, color: "blue", text: "施工单位" }],
    [2, { value: 2, color: "#cfc922", text: "业主单位" }],
    [3, { value: 3, color: "green", text: "设计院" }],
    [4, { value: 4, color: "rgba(0, 0, 0, 0.25)", text: "其他单位" }],
  ],
);

/**
 * 客户联系人-列表
 */
export function getClientContactDetailList(
  params: ListParam & {
    client_id?: Client["id"];
  },
) {
  return fetch.GET<List<Client>>(
    fetch.base(`/api/client-contact/list`),
    params,
  );
}

/**
 * 客户-列表
 */
export function getClientList(
  params: ListParam & {
    is_sign?: Client["is_sign"];
    project_id?: Project["id"];
    business_opportunity_id?: BusinessOpportunity["id"];
  },
) {
  return fetch.GET<List<Client>>(fetch.base(`/api/client/list`), params);
}

/** 客户选项 */
export function getClientOption(params: {
  is_sign?: Client["is_sign"];
  project_id?: Project["id"];
  business_opportunity_id?: BusinessOpportunity["id"];
}) {
  return fetch.GET<
    Pick<
      Client,
      | "id"
      | "short_name"
      | "name"
      | "is_sign"
      | "type_show"
      | "is_sign_show"
      | "name_show"
      | "status"
    >[]
  >(fetch.base(`/api/client/list`), params);
}

/**
 * 客户简介
 * @param params
 */
export function getClientIntroduction(params: { id: Client["id"] }) {
  return fetch.GET<Project>(fetch.base(`/api/client/introduction`), params);
}

/**
 * 客户-详情
 */
export function getClient(params: Pick<Client, "id">) {
  return fetch.GET<Client>(fetch.base(`/api/client/detail`), params);
}

/**
 * 客户-添加
 */
export function addClient(
  params: Partial<
    Pick<
      Client,
      "name" | "short_name" | "type" | "nature" | "address" | "is_sign"
    >
  > &
    AddresssParams & { project_id?: Project["id"] },
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
export function deleteClient(params: Pick<Client, "id">) {
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
