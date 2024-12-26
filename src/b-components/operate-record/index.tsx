import { ProTable } from "@ant-design/pro-components/es";
import React, { useEffect } from "react";

import useOption from "src/hooks/use-option";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";

export default function <T>(props: {
  id: T;
  recordApi: (params: { id: T }) => Promise<BaseResponse<OperateRecord[]>>;
}) {
  const { id, recordApi } = props;
  const [data] = useOption(recordApi);

  useEffect(() => {
    data.params.id = id;
    data.loadOption();
  }, [data, id]);

  const column = tableColumn<OperateRecord>([
    {
      title: "操作人",
      width: 160,
      ellipsis: true,
      renderText(_, row) {
        return row.created_user.name;
      },
    },
    {
      title: "操作",
      width: 160,
      ellipsis: true,
      dataIndex: "action",
    },
    {
      title: "操作日志",
      width: 400,
      ellipsis: true,
      dataIndex: "remark",
    },
    {
      title: "操作时间",
      width: 160,
      ellipsis: true,
      dataIndex: "created_at",
    },
  ]);

  return (
    <ProTable
      loading={data.loading}
      search={false}
      pagination={false}
      dataSource={data.list}
      options={{ reload: data.loadOption, density: false }}
      scroll={{ y: "50vh", x: tableMeasureColumnWidth(column) }}
      columns={column}
    />
  );
}
