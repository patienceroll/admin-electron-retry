import React from "react";
import styled, { useTheme } from "styled-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import { getLogisticsContractList } from "src/apps/admin/api/logistics-contract";
import usePageTableHeight from "src/hooks/use-page-table-height";

function LogisticsContract() {
  const table = useSearchTable(getLogisticsContractList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 4 : 14)
  );

  return <PageWrapper></PageWrapper>;
}

export default styled(LogisticsContract)``;
