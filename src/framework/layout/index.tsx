import React from "react";
import styled from "styled-components";

function Layout(props: StyledWrapComponents) {
  const { className } = props;
  return <div className={className}>123</div>;
}

export default styled(Layout)`
  height: 100vh;
`;
