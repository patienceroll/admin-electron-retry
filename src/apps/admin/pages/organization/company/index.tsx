import React, { useEffect } from "react";
import PageWrapper from "src/framework/component/page-wrapper";
import styled from "styled-components";

import { getCompanyList } from "src/apps/admin/api/company";

function company(props: StyledWrapComponents) {
  const { className } = props;

  useEffect(() => {
    setInterval(() => {
      getCompanyList({page:1,pageSize:20})
    }, 1500);
  }, []);
  return <PageWrapper className={className}>123</PageWrapper>;
}

export default styled(company)``;
