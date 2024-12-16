import Dexie, { type EntityTable } from "dexie";
import { ColumnsState } from "@ant-design/pro-components";

export interface DexiedColumnState {
  /** 属于哪个项目 */
  app: Apps;
  /** 属于哪张表格 */
  tableName: string;
  data: Record<string, ColumnsState & { width?: number }>;
  id: number;
}

const db = new Dexie("DOMS") as Dexie & {
  columnStateTable: EntityTable<DexiedColumnState, "id">;
};

db.version(1).stores({
  columnStateTable: "++id,app,tableName,data",
});

export default db;
