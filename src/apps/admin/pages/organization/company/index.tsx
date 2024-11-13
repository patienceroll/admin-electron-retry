import React from "react";
import PageWrapper from "src/framework/component/page-wrapper";
import styled from "styled-components";

function company(props:StyledWrapComponents) {
    const {className} = props;
  return (
    <PageWrapper className={className}>
      123
    </PageWrapper>
  );
}

export default styled(company)`
 
`;
