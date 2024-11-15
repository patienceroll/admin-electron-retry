import { useCallback, useMemo, useRef } from "react";

import { TablePaginationConfig, TableProps } from "antd";

import { ProTableProps } from "@ant-design/pro-components";
import useUpdate from "../use-update";
import useWather from "../use-wather";

interface Api<Params, Item> {
  (params: Params): Promise<BaseResponse<List<Item>>>;
}

export default function <P extends Record<string | number, unknown>, Item>(
  api: Api<P, Item>,
) {
  const [update] = useUpdate();

  const [loading] = useWather();

  const page = useRef({ page: 1, pageSize: 15 });
  const params = useRef({} as P);
  const extraParams = useRef({} as P);
  const listResponse = useRef<BaseResponse<List<Item>>>();
  const list = useRef<Item[]>([]);
  /** ProTable 的 Pagination 属性  */
  const pagination = useRef<TablePaginationConfig>({
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
  });

  const _api = useCallback(
    function () {
      const p = Object.assign(
        params.current,
        page.current,
        extraParams.current,
      ) as P;
      return api(p).then((res) => {
        listResponse.current = res;
        return res;
      });
    },
    [api],
  );

  const getData = useCallback(
    function () {
      loading.setTrue();
      return _api()
        .then((res) => {
          list.current = res.data.list;
          page.current.page = res.data.pageInfo.page;
          page.current.pageSize = res.data.pageInfo.pageSize;
          pagination.current.current = res.data.pageInfo.page;
          pagination.current.total = res.data.pageInfo.total;
          pagination.current.pageSize = res.data.pageInfo.pageSize;
          update();
        })
        .finally(loading.setFalse);
    },
    [_api, loading, update],
  );

  const options: ProTableProps<Item, P>["options"] = useMemo(
    () => ({
      reload: getData,
      density: false,
    }),
    [getData],
  );

  const onChange = useCallback<NonNullable<TableProps<Item>["onChange"]>>(
    (_pagination, filters, sorter, action) => {
      if (action.action === "paginate") {
        page.current.page = _pagination.current || 1;
        page.current.pageSize = _pagination.pageSize || 10;
        pagination.current = _pagination;
      }
      //   if (action.action === "filter") {
      //     Object.keys(filters).forEach((key) => {
      //       if (Array.isArray(filters[key]))
      //         (params.current as any)[key] = filters[key];
      //       else (params.current as any)[key] = undefined;
      //     });
      //   }
      getData();
    },
    [getData],
  );

  const returnValue = useMemo(
    () => ({
      getData,
      reload: getData,
      loading: loading.whether,
      params,
      extraParams,
      pagination: pagination.current,
      dataSource: list.current,
      options,
      onChange,
    }),
    [getData, loading.whether, onChange, options],
  );

  return [returnValue];
}
