import { Button } from "antd";
import React from "react";
import styled from "styled-components";

const DIV = styled.div`
  height: 100vh;
`;

export default function () {
  return (
    <DIV>
      <Button onClick={window.preload.login}>登录</Button>
      <Button onClick={window.preload.showMenu}>菜单</Button>
    </DIV>
  );
}
