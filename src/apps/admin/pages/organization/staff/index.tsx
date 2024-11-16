import React from "react";
import styled from "styled-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useWather from "src/hooks/use-wather";

function Staff() {
  const [loading] = useWather();

  return <PageWrapper>员工</PageWrapper>;
}

export default styled(Staff)``;
