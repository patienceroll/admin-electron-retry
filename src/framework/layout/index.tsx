import React from "react";
import styled from "styled-components";

import TitleBar from "src/framework/layout/components/title-bar";
import Content from "src/framework/layout/components/content";

function Layout(props: StyledWrapComponents) {
  const { className } = props;
  return (
    <div className={className}>
      <TitleBar />
      <Content />
    </div>
  );
}

export default styled(Layout)`
  height: 100vh;
`;
