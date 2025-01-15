import fetch from "src/util/fetch";

export const produceReceiveStatus = new Map<
  ProduceReceive["status"],
  EnumValue<ProduceReceive["status"]>
>([
  [0, { value: 0, color: "rgb(64,124,72)", text: "草稿" }],
  [1, { value: 1, color: "#4ff7cf", text: "待领料" }],
  [3, { value: 3, color: "#3a50b9", text: "已领料" }],
  [4, { value: 4, color: "rgb(156,156,148)", text: "已作废" }],
]);

/**
 * 生产领料-列表
 */
export function getProduceReceiveList(
  params: ListParam & {
    status?: BillStatus;
    /**
     * 是否返回明细;0:否,1:是
     */
    is_show_detail: 0 | 1;
    /**
     * 生产加工id
     */
    produce_complete_id: ProduceComplete["id"];
  },
) {
  return fetch.GET<List<ProduceReceive>>(
    fetch.base(`/api/produce-receive/list`),
    params,
  );
}

/**
 * 生产领料-详情
 */
export function getProduceReceive(params: Pick<ProduceReceive, "id">) {
  return fetch.GET<ProduceReceive>(
    fetch.base(`/api/produce-receive/detail`),
    params,
  );
}

/**
 * 生产领料-添加
 */
export function addProduceReceive(params: any) {
  return fetch.POST<ProduceReceiveAddResponse>(
    fetch.base(`/api/produce-receive`),
    params,
  );
}

/**
 * 生产领料-编辑
 */
export function editProduceReceive(params: any) {
  return fetch.PUT(fetch.base(`/api/produce-receive`), params);
}

/**
 * 生产领料-删除
 */
export function deleteProduceReceive(params: Pick<ProduceReceive, "id">) {
  return fetch.DELETE(fetch.base(`/api/produce-receive`), params);
}

/**
 * 生成合同编号 */
export const getProduceReceiveCode = () => {
  return fetch.GET<{ code: string; prefix: string }>(
    fetch.base("/api/produce-receive/code"),
  );
};

/**
 * 物资.弹窗 */
export const getInventoryMaterial = (
  params: ListParam & {
    id?: ProduceReceive["id"];
  },
) => {
  return fetch.GET<List<ProduceReceiveMaterialSku>>(
    fetch.base("/api/produce-receive/inventory-material"),
    params,
  );
};

/**
 * 物资.弹窗-保存
 */
export const postProduceReceiveMaterialSku = (data: {
  id: ProduceReceive["id"];
  ids: ProduceReceiveMaterialSku["id"][];
}) => {
  return fetch.POST(
    fetch.base("/api/produce-receive/inventory-material"),
    data,
  );
};

/** 生产领料-发起审批 */
export function startApproval(params: Pick<ProduceReceive, "id">) {
  return fetch.POST(fetch.base(`/api/produce-receive/start-approval`), params);
}

/** 生产领料-审批 */
export function approval(params: {
  id: ProduceReceive["id"];
  result: 1 | 2;
  remark: string;
}) {
  return fetch.POST(fetch.base(`/api/produce-receive/approval`), params);
}

/** 生产领料-作废 */
export function billInvalid(params: Pick<ProduceReceive, "id">) {
  return fetch.POST(fetch.base(`/api/produce-receive/invalid`), params);
}

/** 生产领料-撤销 */
export function cancelOperate(params: Pick<ProduceReceive, "id">) {
  return fetch.POST(fetch.base(`/api/produce-receive/cancel-operate`), params);
}

/** 生产领料-完成入库 */
export function billEnd(params: Pick<ProduceReceive, "id">) {
  return fetch.POST(fetch.base(`/api/produce-receive/end`), params);
}

/** 生产领料-开始入库 */
export function billStart(params: Pick<ProduceReceive, "id">) {
  return fetch.POST(fetch.base(`/api/produce-receive/start`), params);
}

/** 生产领料-审批记录 */
export function getApprovalRecord(params: Pick<ProduceReceive, "id">) {
  return fetch.GET<ApprovalRecord[]>(
    fetch.base(`/api/produce-receive/approval-record`),
    params,
  );
}

/** 生产领料 删除条码 */
export function produceRecieveDeleteBarcode(
  params: Pick<ProduceReceive, "id"> & {
    relation_id: ProduceCompleteReceive["barcodes"][number]["relation_id"];
  },
) {
  return fetch.DELETE(
    fetch.base(`/api/produce-receive-detail/barcode`),
    params,
  );
}

/** 生产领料-导出 */
export function produceReceiveExport(params: Record<string, any>) {
  return fetch.GET<ExportRes>(
    fetch.base(`/api/produce-receive/export`),
    params,
  );
}

/** 生产领料-操作记录 */
export function getOperateRecord(params: Pick<ProduceReceive, "id">) {
  return fetch.GET<OperateRecord[]>(
    fetch.base(`/api/produce-receive/log`),
    params,
  );
}
