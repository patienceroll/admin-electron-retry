import React from "react";
import styled from "styled-components";
import { Button } from "antd";

function Login(props: StyledWrapComponents) {
  const { className } = props;
  return <div className={className}>
    <Button onClick={() => {
        window.preload.loginSuccess({token:'123'})
    }}>登录成功</Button>
  </div>;
}

export default styled(Login)`
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
