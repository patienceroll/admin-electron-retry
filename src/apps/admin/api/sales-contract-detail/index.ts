import fetch from "src/util/fetch";

/**
 * 销售合同明细-列表
 */
export function getSalesContractDetailList(
  params: ListParam & {
    sales_contract_id?: SalesContract["id"];
  }
) {
  return fetch.GET<List<SalesContractDetail>>(
    fetch.base(`/api/sales-contract-detail/list`),
    params
  );
}

/**
 * 销售合同明细-render数据
 */
export function getSalesContractDetailRender(params: {
  sales_contract_id?: SalesContract["id"];
  main_status?: BillStatus;
}) {
  return fetch.GET<ExcelTableData>(
    fetch.base(`/api/sales-contract-detail/list`),
    {
      is_render: 1,
      ...params,
    }
  );
}

/**
 * 销售合同明细-详情
 */
export function getSalesContractDetail(
  params: Pick<SalesContractDetail, "id">
) {
  return fetch.GET<SalesContractDetail>(
    fetch.base(`/api/sales-contract-detail/detail`),
    params
  );
}

/**
 * 销售合同明细-添加
 */
export function addSalesContractDetail(params: any) {
  return fetch.POST(fetch.base(`/api/sales-contract-detail`), params);
}

/**
 * 销售合同明细-编辑
 */
export function editSalesContractDetail(params: any) {
  return fetch.PUT(fetch.base(`/api/sales-contract-detail`), params);
}

/**
 * 销售合同明细-删除
 */
export function deleteSalesContractDetail(
  params: Pick<SalesContractDetail, "id">
) {
  return fetch.DELETE(fetch.base(`/api/sales-contract-detail`), params);
}

/** 销售合同明细-导出 */
export function salesContractDetailExport(params: Record<string, any>) {
  return fetch.GET<{
    file_name: string;
    file_path: string;
    remote_path: string;
  }>(fetch.base(`/api/sales-contract-detail/export`), params);
}

/** 销售合同明细-获取物资执行单位  */
export function salesContractDetailUnit(
  params: Pick<SalesContractDetail, "id">
) {
  return fetch.GET<Unit[]>(
    fetch.base(`/api/sales-contract-detail/unit`),
    params
  );
}

/** 销售合同明细-设置物资执行单位 */
export function salesContractDetailUnitSet(params: {
  remark: string;
  data: {
    /**
     * 是否执行单位;0:否,1:是
     */
    is_execute: number;
    /**
     * 物资单位id
     */
    material_unit_id: number;
    /**
     * 数量
     */
    num: number;
    /**
     * 单价
     */
    price: string;
  }[];
  attr_snapshoot: Record<string, string>;
  id: SalesContractDetail["id"];
}) {
  return fetch.POST(fetch.base(`/api/sales-contract-detail/unit`), params);
}

/** 销售合同明细渲染字段 */
export function salesContractDetailRenderConfig(params: {
  sales_contract_id: SalesContract["id"];
}) {
  return fetch.GET<RenderConfig>(
    fetch.base(`/api/sales-contract-detail/render`),
    params
  );
}

