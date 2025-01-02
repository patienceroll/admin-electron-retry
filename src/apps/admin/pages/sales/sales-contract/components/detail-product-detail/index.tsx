import React from "react";
import ProTable from "@ant-design/pro-table";

import { getSalesContractDetailList } from "src/apps/admin/api/sales-contract-detail";
import useSearchTable from "src/hooks/use-search-table";

export default function (props: Pick<SalesContract, "id">) {
  const { id } = props;
  const table = useSearchTable(getSalesContractDetailList);

  return <ProTable />;
}
