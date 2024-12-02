import styled from "styled-components";
import React, { useState } from "react";
import { Segmented } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import Title from "src/framework/component/title";
import Admin from "./admin";

function Menu(props: StyledWrapComponents) {
  const { className } = props;
  const [type, setType] = useState<"admin" | "app">("admin");

  return (
    <PageWrapper className={className}>
      <div className="title">
        <Title style={{ flex: 1 }}>设置菜单</Title>
        <div className="action">
          <Segmented
            value={type}
            onChange={setType}
            options={[
              {
                value: "admin",
                label: "管理端",
              },
              {
                value: "app",
                label: "手机端",
              },
            ]}
          />
        </div>
      </div>
      {type === "admin" && <Admin />}
    </PageWrapper>
  );
}

export default styled(Menu)`
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${props => props.theme.margin}px;
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
