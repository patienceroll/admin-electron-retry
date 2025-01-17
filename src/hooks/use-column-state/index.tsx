import React, { useCallback, useEffect, useRef, useState } from "react";
import { ColumnsState, ProColumns } from "@ant-design/pro-components";
import { Resizable } from "react-resizable";

import db, { type DexiedColumnState } from "src/util/db";

import "react-resizable/css/styles.css";

export default function useTableColumnState<T>(
  tableName: DexiedColumnState["tableName"],
  column: ProColumns<T>[],
  app: Apps = "admin"
) {
  const [data, setData] = useState<DexiedColumnState>();

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
    db.columnStateTable
      .where("tableName")
      .equals(tableName)
      .and((item) => item.app === app)
      .first()
      .then((result) => {
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

  return {
    onChange,
    data,
    tableHeaderCellRender,
    column: column.map((item) => {
      if (typeof item.dataIndex === "string" && data) {
        const wid = data.data[item.dataIndex]?.width;
        return { ...item, width: wid ? wid : item.width };
      } else {
        return item;
      }
    }),
  };
}
