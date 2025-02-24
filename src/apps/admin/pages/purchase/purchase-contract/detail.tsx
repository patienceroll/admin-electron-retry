import React from "react";

import PageWrapper from "src/framework/component/page-wrapper";
import styled from "styled-components";


function Detail(props: StyledWrapComponents) {
    return <PageWrapper>
        采购合同详情
    </PageWrapper>
}

export default styled(Detail)`
  padding-right: 200px;

  .anchor {
    position: fixed;
    top: ${(props) => props.theme.margin}px;
    right: 50px;
  }
`;
