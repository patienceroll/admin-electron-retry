import fetch from "src/util/fetch";



/** 消息状态枚举 */
export const messageStatus: Map<
  MessageListItem["status"],
  EnumValue<MessageListItem["status"]>
> = new Map([
  [0, { value: 0, color: "red", text: "推送失败" }],
  [1, { value: 1, color: "green", text: "未查看" }],
  [2, { value: 2, color: "#cfc922", text: "已查看" }],
]);

/**
 * 站内信息-列表
 */
export function getMessageList(params: ListParam) {
  return fetch.GET<List<MessageListItem>>(
    fetch.base(`/api/message/list`),
    params
  );
}

/**
 * 站内信息-阅读
 */
export function messageRead(params: Pick<MessageListItem, "id">) {
  return fetch.POST(fetch.base(`/api/message/see`), params);
}
