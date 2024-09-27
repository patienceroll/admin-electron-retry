import React from "react";
import styled from "styled-components";

import logo from "src/assets/logo/logo@512x512.png";

function Component(props: StyledWrapComponents) {
  return (
    <div className={props.className}>
      <div className="bar">
        <div className="title">
          <img src={logo} />
          &nbsp;
          <span>DOMS</span>
        </div>

        <div className="content"></div>
      </div>
    </div>
  );
}

export default styled(Component)`
  height: 30px;
  background-color: ${(props) => props.theme.colorPrimaryBg};

  .bar {
    height: 30px;
    display: flex;
    user-select: none;
  }

  .title {
    flex-shrink: 0;
    padding-inline: 8px;
    cursor: default;

    > img {
      width: 18px;
      height: 18px;
      line-height: 30px;
      vertical-align: middle;
    }

    > span {
      font-size: 16px;
      line-height: 30px;
      vertical-align: middle;
    }
  }
`;
