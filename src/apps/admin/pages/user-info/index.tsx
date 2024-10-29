import { Button } from "antd";
import React from "react";
import styled from "styled-components";

const DIV = styled.div``;

export default function () {
  return (
    <DIV>
      user-info
      <Button onClick={window.preload.login}>去登录</Button>
    </DIV>
  );
}
