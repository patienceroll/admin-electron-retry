/// <reference types="@amap/amap-jsapi-types" />

/* eslint-disable @typescript-eslint/no-unused-vars */

declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  import { ComponentType, SVGProps } from "react";

  const content: ComponentType<SVGProps<SVGSVGElement>>;
  export default content;
}

declare namespace AMap {
  class PlaceSearch {
    constructor(options?: {
      /** 城市 */
      city?: string;
      /** 数据类别 */
      type?: string;
      /** 每页结果数,默认10 */
      pageSize?: number;
      /** 请求页码，默认1 */
      pageIndex?: number;
      /** 返回信息详略，默认为base（基本信息） */
      extensions?: "base";
    });

    search: (
      keyword: string,
      callback: (
        status: AMap.Geocoder.SearchStatus,
        result: string | Record<string, any> | 0,
      ) => void,
    ) => void;
  }
}

interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string;
  };
  preload: LocalPreload &
    ThemePreload &
    LoginPreload &
    RoutePreload &
    WindowPreload &
    FilesPreload;
}

type DisposeFunction = VoidFunction;
type StyledWrapComponents<T = unknown> = {
  className?: string;
} & T;

type ListParam<T = {}> = {
  page: number;
  pageSize: number;
} & T;

type List<T> = {
  list: T[];
  pageInfo: {
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
};

type OptionParams<T> = {
  page: -1;
} & T;

type EnumValue<Value> = {
  value: Value;
  color: React.CSSProperties["color"];
  text: string;
};

/** 权限 1 表示有权限 */
type BtnPower = Partial<{
  /** 启用 */
  is_enable: 0 | 1;
  /** 1可以删除，0不可删除 */
  is_edit: 1 | 0;
  /** 删除 */
  is_delete: 1 | 0;
  /** 提交一个审批 */
  is_submit: 1 | 0;
  /** 审批 */
  is_approve: 1 | 0;
  /** 取消申请 */
  is_cancel: 1 | 0;
  /** 作废 */
  is_invalid: 1 | 0;
  /** 取消作废 */
  is_cancel_invalid: 1 | 0;
  /** 中止 */
  is_suspend: 1 | 0;
  /** 取消中止 */
  is_cancel_suspend: 1 | 0;
  /** 完结 */
  is_end: 1 | 0;
  /** 取消完结 */
  is_cancel_end: 1 | 0;
  /** 提交跟进内容 */
  is_save_process: 1 | 0;
  /** 点评 */
  is_evaluate: 1 | 0;
  /** 开始入库（其他可随意修改文案） */
  is_start: 1 | 0;
  /** 是否可以申请 */
  is_apply: 0 | 1;
  /** 开始收货 */
  is_receive: 0 | 1;
  /** 修改金额 */
  is_amend: 0 | 1;
  /** 撤销 */
  is_cancel_operate: 0 | 1;
}>;


type AddresssParams = {
  province?: string;
  city?: string;
  county?: string;
  address?: string;
  longitude?: string;
  latitude?: string;
}