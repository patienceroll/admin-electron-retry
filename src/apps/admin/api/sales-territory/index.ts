import fetch from "src/util/fetch";

/**
 * 区域-列表
 */
export function getAreaList(params: ListParam & {}) {
  return fetch.GET<List<Area>>(fetch.base(`/api/area/list`), params);
}

/**
 * 区域-选项
 */
export function getAreaOption(params: {}) {
  return fetch.GET<Area[]>(fetch.base(`/api/area/list`), params);
}

/** 新增区域 */
export function addArea(params: {
  /**
   * 区域编码
   */
  code: string;
  /**
   * 颜色
   */
  color: string;
  /**
   * 区域名称
   */
  name: string;
  /**
   * 行政区域
   */
  regions: {
    /**
     * 市
     */
    city: string;
    /**
     * 行政编码code
     */
    code: string;
    /**
     * 区
     */
    county: string;
    /**
     * 省
     */
    province: string;
  }[];
  /**
   * 备注
   */
  remark: string;
  /**
   * 业务员ids
   */
  staff_ids: number[];
}) {
  return fetch.POST(fetch.base(`/api/area`), params);
}

/** 编辑区域 */
export function editArea(params: {
  id: Area["id"];
  /**
   * 区域编码
   */
  code: string;
  /**
   * 颜色
   */
  color: string;
  /**
   * 区域名称
   */
  name: string;
  /**
   * 行政区域
   */
  regions: {
    /**
     * 市
     */
    city: string;
    /**
     * 行政编码code
     */
    code: string;
    /**
     * 区
     */
    county: string;
    /**
     * 省
     */
    province: string;
  }[];
  /**
   * 备注
   */
  remark: string;
  /**
   * 业务员ids
   */
  staff_ids: number[];
}) {
  return fetch.PUT(fetch.base(`/api/area`), params);
}

/** 当前区域可选的行政区树 */
export function getRegionTree(params: { area_id?: string }) {
  return fetch.GET<ReginTree[]>(fetch.base(`/api/area/region-tree`), params);
}
