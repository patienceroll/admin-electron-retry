import { List } from "antd";
import React from "react";
import styled from "styled-components";

const DIV = styled.div`
  height: 100vh;
`;

export default function () {
 
  return (
    <DIV>
      <List
        dataSource={window.preload.getLocalUserMenu()}
        renderItem={(item) => <List.Item  >{item.name}</List.Item>}
      />
    </DIV>
  );
}
