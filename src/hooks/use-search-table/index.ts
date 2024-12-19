import { useCallback, useMemo, useRef } from "react";
import { TablePaginationConfig, TableProps } from "antd";
import { ProColumns, ProTableProps } from "@ant-design/pro-components";

import useUpdate from "../use-update";
import useWather from "../use-wather";

interface Api<Params, Item> {
  (params: Params): Promise<BaseResponse<List<Item>>>;
}

export function tableColumn<T>(column: ProColumns<T>[]): ProColumns<T>[] {
  return column.map((item) =>
    Object.assign<ProColumns<T>, ProColumns<T>>(
      {
        width: 120,
        // align: "center",
        onHeaderCell(row) {
          return Object.assign<any, any>(
            { columnData: row },
            item.onHeaderCell?.(row) || {}
          );
        },
      },
      item
    )
  );
}

export function tableMeasureColumnWidth<T>(column: ProColumns<T>[]) {
  return column.reduce((pre, current) => pre + Number(current.width || 0), 0);
}

export default function <P extends Record<string | number, unknown>, Item>(
  api: Api<P, Item>
) {
  const [update] = useUpdate();

  const [loading] = useWather();

  const page = useRef({ page: 1, pageSize: 20 });
  const params = useRef({} as P);
  const extraParams = useRef({} as P);
  const listResponse = useRef<BaseResponse<List<Item>>>();
  const list = useRef<Item[]>([]);
  /** ProTable 的 Pagination 属性  */
  const pagination = useRef<TablePaginationConfig>({
    pageSize: 20,
    total: 0,
    showSizeChanger: true,
  });

  const _api = useCallback(
    function () {
      const p = Object.assign(
        params.current,
        page.current,
        extraParams.current
      ) as P;
      return api(p).then((res) => {
        listResponse.current = res;
        return res;
      });
    },
    [api]
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
    [_api, loading, update]
  );

  const options: ProTableProps<Item, P>["options"] = useMemo(
    () => ({
      reload: getData,
      density: false,
    }),
    [getData]
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
    [getData]
  );

  const onReset = useCallback(() => {
    page.current.page = 1;
    params.current = {} as P;
    getData();
  }, [getData]);

  const onFinish = useCallback(
    (store: any) => {
      page.current.page = 1;
      params.current = store;
      return getData();
    },
    [getData]
  );

  const column: (column: ProColumns<Item>[]) => ProColumns<Item>[] =
    useCallback(tableColumn, []);

  const measureColumnWidth = useCallback(tableMeasureColumnWidth, []);

  return useMemo(
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
      onReset,
      onFinish,
      column,
      measureColumnWidth,
    }),
    [
      getData,
      loading.whether,
      options,
      onChange,
      onReset,
      onFinish,
      column,
      measureColumnWidth,
    ]
  );
}
