import fetch from "src/util/fetch";

export const produceReturnStatus = new Map<
  ProduceReturn["status"],
  EnumValue<ProduceReturn["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待退料" }],
  [3, { value: 3, color: "#3a50b9", text: "已退料" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 生产退料-列表
 */
export function getProduceReturnList(
  params: ListParam & {
    status?: BillStatus;
  },
) {
  return fetch.GET<List<ProduceReturn>>(
    fetch.base(`/api/produce-return/list`),
    params,
  );
}

/**
 * 生产退料-详情
 */
export function getProduceReturn(params: Pick<ProduceReturn, "id">) {
  return fetch.GET<ProduceReturn>(
    fetch.base(`/api/produce-return/detail`),
    params,
  );
}

/**
 * 生产退料-添加
 */
export function addProduceReturn(params: any) {
  return fetch.POST<ProduceReturnAddResponse>(
    fetch.base(`/api/produce-return`),
    params,
  );
}

/**
 * 生产退料-编辑
 */
export function editProduceReturn(params: any) {
  return fetch.PUT(fetch.base(`/api/produce-return`), params);
}

/**
 * 生产退料-删除
 */
export function deleteProduceReturn(params: Pick<ProduceReturn, "id">) {
  return fetch.DELETE(fetch.base(`/api/produce-return`), params);
}

/**
 * 生成合同编号 */
export const getProduceReturnCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/produce-return/code"),
  );
};

/**
 * 物资.弹窗 */
export const getReceiveMaterial = (
  params: ListParam & {
    id?: ProduceReturn["id"];
  },
) => {
  return fetch.GET<List<ProduceReturnMaterialSku>>(
    fetch.base("/api/produce-return/receive-material"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postProduceReturnDetail = (data: {
  id: ProduceReturn["id"];
  ids: ProduceReturnMaterialSku["id"][];
}) => {
  return fetch.POST(fetch.base("/api/produce-return/receive-material"), data);
};

/** 生产退料-发起审批 */
export function startApproval(params: Pick<ProduceReturn, "id">) {
  return fetch.POST(fetch.base(`/api/produce-return/start-approval`), params);
}

/** 生产退料-审批 */
export function approval(params: {
  id: ProduceReturn["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/produce-return/approval`), params);
}

/** 生产退料-作废 */
export function billInvalid(params: Pick<ProduceReturn, "id">) {
  return fetch.POST(fetch.base(`/api/produce-return/invalid`), params);
}

/** 生产退料-撤销 */
export function cancelOperate(params: Pick<ProduceReturn, "id">) {
  return fetch.POST(fetch.base(`/api/produce-return/cancel-operate`), params);
}

/** 生产退料-完成入库 */
export function billEnd(params: Pick<ProduceReturn, "id">) {
  return fetch.POST(fetch.base(`/api/produce-return/end`), params);
}

/** 生产退料-开始入库 */
export function billStart(params: Pick<ProduceReturn, "id">) {
  return fetch.POST(fetch.base(`/api/produce-return/start`), params);
}

/** 生产退料-审批记录 */
export function getApprovalRecord(params: Pick<ProduceReturn, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/produce-return/approval-record`),
    params,
  );
}

/** 生产退料 删除条码 */
export function produceReturnDeleteBarcode(
  params: Pick<ProduceReturn, "id"> & {
    relation_id: ProduceCompleteReceive["barcodes"][number]["relation_id"];
  },
) {
  return fetch.DELETE(fetch.base(`/api/produce-return-detail/barcode`), params);
}

/** 生产退料-导出 */
export function produceReturnExport(params: Record<string, any>) {
  return fetch.GET<ExportRes>(fetch.base(`/api/produce-return/export`), params);
}

/** 生产退料-操作记录 */
export function getOperateRecord(params: Pick<ProduceReturn, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/produce-return/log`),
    params,
  );
}
