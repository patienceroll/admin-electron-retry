import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColumnsState, ProColumns } from "@ant-design/pro-components";
import { Resizable } from "react-resizable";

import db, { type DexiedColumnState } from "src/util/db";

import "react-resizable/css/styles.css";
import key from "src/util/key";

export default function useTableColumnState<T>(
  tableName: DexiedColumnState["tableName"],
  column: ProColumns<T>[],
  app: Apps = "admin"
) {
  const [data, setData] = useState<DexiedColumnState>();
  const latestTag = useRef("");

  const [memoryColumn, setMemoryColumn] = useState<ProColumns<T>[]>([]);

  useEffect(() => {
    const memoryColumnDataIndex = memoryColumn
      .map((item) => item.dataIndex)
      .join("");
    const columnDataIndex = column.map((item) => item.dataIndex).join("");
    if (memoryColumnDataIndex !== columnDataIndex) {
      setMemoryColumn(column);
    }
  }, [column, memoryColumn]);

  const generateDexiedColumnState = useCallback(
    function (oldState?: DexiedColumnState) {
      const newState: DexiedColumnState["data"] = {};
      const oldData = oldState?.data || {};
      memoryColumn.forEach((item) => {
        if (typeof item.dataIndex === "string") {
          const oldItem = oldData[item.dataIndex];
          if (oldItem) {
            newState[item.dataIndex] = {
              ...oldItem,
            };
          } else {
            newState[item.dataIndex] = {
              width: typeof item.width === "number" ? item.width : undefined,
              fixed: typeof item.fixed !== "boolean" ? item.fixed : undefined,
            };
          }
        }
      });
      return newState;
    },
    [memoryColumn]
  );

  useEffect(() => {
    const tag = key.randomString();
    latestTag.current = tag;
    db.columnStateTable
      .where("tableName")
      .equals(tableName)
      .and((item) => item.app === app)
      .first()
      .then((result) => {
        if (tag !== latestTag.current) return;
        const newState = generateDexiedColumnState(result);
        if (!result) {
          db.columnStateTable
            .add({ app, tableName, data: newState })
            .then((id) => {
              setData({ id, data: newState, app, tableName });
            });
        } else {
          db.columnStateTable.update(result.id, { data: newState }).then(() => {
            setData({ ...result, data: newState });
          });
        }
      });
  }, [app, generateDexiedColumnState, tableName]);

  function onChange(state: Record<string, ColumnsState>) {
    const newData: DexiedColumnState["data"] = {};
    Object.keys(state).forEach((key) => {
      const columnWidth = column.find((c) => c.dataIndex === key)?.width;
      newData[key] = {
        ...state[key],
        width: typeof columnWidth === "number" ? columnWidth : undefined,
      };
    });
    if (data) {
      db.columnStateTable.update(data.id, { data: newData }).then(() => {
        setData({ ...data, data: newData });
      });
    } else {
      db.columnStateTable.add({ app, tableName, data: newData }).then((id) => {
        setData({ id, data: newData, app, tableName });
      });
    }
  }

  function tableHeaderCellRender(
    props: React.HtmlHTMLAttributes<HTMLTableCellElement> & {
      columnData?: ProColumns<any>;
    }
  ) {
    const { columnData, ...rest } = props;
    const start = useRef(0);
    const th = useRef<HTMLTableCellElement>(null);

    if (!columnData) return <th {...rest} ref={th} />;

    return (
      /** @ts-ignore */
      <Resizable
        axis="x"
        width={100}
        onResizeStart={(e) => {
          start.current = (e as any).clientX as number;
        }}
        onResizeStop={(e) => {
          if (data) {
            const stop = (e as any).clientX as number;
            let changeWidth = 0;
            const elementWidth = th.current?.clientWidth || 100;
            changeWidth = stop - start.current;

            const finalWidth =
              changeWidth + elementWidth < 100
                ? 100
                : changeWidth + elementWidth;

            const newState = Object.assign({}, data.data);
            newState[columnData.dataIndex].width = finalWidth;
            db.columnStateTable.update(data.id, { data: newState }).then(() => {
              setData({ ...data, data: newState });
            });
          }
        }}
      >
        <th {...rest} ref={th} />
      </Resizable>
    );
  }

  const widthColumn = useMemo(() => {
    return memoryColumn.filter((item) => {
      if (typeof item.dataIndex !== "string") return false;
      if (!data) return true;
      const dataItem = data.data[item.dataIndex];
      if (!dataItem) return true;
      return dataItem.show === undefined || dataItem.show === true;
    });
  }, [memoryColumn, data]);

  const renderColumn = useMemo(() => {
    return memoryColumn.map((item) => {
      if (typeof item.dataIndex === "string" && data) {
        const wid = data.data[item.dataIndex as string]?.width;
        return { ...item, width: wid ? wid : item.width };
      } else {
        return item;
      }
    });
  }, [data, memoryColumn]);

  return {
    onChange,
    data,
    tableHeaderCellRender,
    /** 计算表格宽度的column,根据列的是否展示等有变化 */
    widthColumn,
    /** 用于表格渲染的column,通知表格列的数据,此数据主要用于影响表格列的宽度 */
    column: renderColumn,
  };
}
