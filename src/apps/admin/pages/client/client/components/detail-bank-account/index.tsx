import { ProTable } from "@ant-design/pro-components";
import React, { useEffect } from "react";
import { getBankAccountList } from "src/apps/admin/api/bank-account";

import useSearchTable from "src/hooks/use-search-table";
import { useTheme } from "styled-components";

export default function (props: { id: Client["id"] }) {
  const { id } = props;
  const theme = useTheme();

  const bankAccount = useSearchTable(getBankAccountList);

  useEffect(() => {
    bankAccount.extraParams.current.table_id = Number(id);
    bankAccount.extraParams.current.type = 2;
    bankAccount.extraParams.current.table = "client";
    bankAccount.reload();
  },[id]);

  const bankAccountColumn = bankAccount.column([
    {
      title: "公司",
      dataIndex: "company_name",
    },
    {
      title: "地址",
      dataIndex: "company_address",
    },
    {
      title: "联系人",
      dataIndex: "linkman",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "银行",
      dataIndex: "bank_name",
    },
    {
      title: "开户行",
      dataIndex: "bank_address",
    },
    {
      title: "税号",
      dataIndex: "tax_code",
    },
    {
      title: "账号",
      dataIndex: "account",
    },
  ]);

  return (
    <ProTable
      search={false}
      rowKey="id"
      style={{ marginTop: theme.margin }}
      options={bankAccount.options}
      loading={bankAccount.loading}
      dataSource={bankAccount.dataSource}
      pagination={bankAccount.pagination}
      onChange={bankAccount.onChange}
      columns={bankAccountColumn}
      scroll={{ x: bankAccount.measureColumnWidth(bankAccountColumn) }}
    />
  );
}
