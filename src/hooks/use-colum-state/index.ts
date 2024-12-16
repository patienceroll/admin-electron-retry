import { useEffect, useState } from "react";
import { ColumnsState, ProColumns } from "@ant-design/pro-components";

import db, { type DexiedColumnState } from "src/util/db";

export default function useTableColumnState(
  tableName: DexiedColumnState["tableName"],
  app: Apps = "admin"
) {
  const [data, setData] = useState<DexiedColumnState>();

  useEffect(() => {
    db.columnStateTable
      .where("tableName")
      .equals(tableName)
      .and((item) => item.app === app)
      .first()
      .then(setData);
  }, [app, tableName]);

  function onChange(
    state: Record<string, ColumnsState>,
    column: ProColumns<any>[]
  ) {
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

  return { onChange, data };
}
