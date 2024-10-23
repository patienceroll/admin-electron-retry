import React from "react";
import styled from "styled-components";

function PageWrapper(props: StyledWrapComponents) {
  return <div className={props.className}></div>;
}

export default styled(PageWrapper);
