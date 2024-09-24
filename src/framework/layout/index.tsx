import React, { PropsWithChildren } from "react";
import styled from "styled-components";

export default styled(function Layout(props: { className?: string }) {
  return <div className={props.className}></div>;
})`
  height: 100vh;
`;
