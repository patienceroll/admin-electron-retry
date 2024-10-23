import React from "react";
import styled from "styled-components";

import TitleBar from "src/framework/layout/components/title-bar";

function Layout(props: StyledWrapComponents) {
  const { className } = props;
  return (
    <div className={className}>
      <TitleBar />
    </div>
  );
}

export default styled(Layout)`
  height: 100vh;
`;
