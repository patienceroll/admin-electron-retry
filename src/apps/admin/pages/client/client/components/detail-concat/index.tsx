import { ProTable } from "@ant-design/pro-components";
import React, { useEffect } from "react";

import { getClientContactList } from "src/apps/admin/api/client-concat";
import useSearchTable from "src/hooks/use-search-table";
import { useTheme } from "styled-components";

export default function (props: { id: Client["id"] }) {
  const { id } = props;
  const theme = useTheme();

  const concat = useSearchTable(getClientContactList);
  useEffect(() => {
    concat.extraParams.current.client_id = Number(id);
    concat.reload();
  },[id]);
  return (
    <ProTable
      className="custom-pro-table"
      search={false}
      rowKey="id"
      style={{ marginTop: theme.margin }}
      scroll={{ y: 400 }}
      options={concat.options}
      loading={concat.loading}
      dataSource={concat.dataSource}
      pagination={concat.pagination}
      onChange={concat.onChange}
      columns={concat.column([
        {
          title: "姓名",
          dataIndex: "name",
        },
        {
          title: "职位",
          dataIndex: "job_title",
        },
        {
          title: "手机",
          dataIndex: "phone",
        },
        {
          title: "微信",
          dataIndex: "wechat",
        },
        {
          title: "身份证",
          dataIndex: "ID_card",
        },
      ])}
    />
  );
}
