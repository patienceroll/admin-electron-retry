import { Watermark } from "antd";
import React, { PropsWithChildren, useState } from "react";
import styled from "styled-components";

function PageWrapper(props: StyledWrapComponents<PropsWithChildren>) {
  const [user] = useState(window.preload.getLocalUser);
  return (
    <Watermark className={props.className} content={user?.name} font={{fontSize:10,color:`rgba(0,0,0,0.05)`}}>
      {props.children}
    </Watermark>
  );
}

export default styled(PageWrapper)`
  min-height: 100vh;
`;
