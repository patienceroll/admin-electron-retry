import React from "react";
import styled from "styled-components";
import { Button } from "antd";

import images from "src/assets/images";

function Login(props: StyledWrapComponents) {
  const { className } = props;
  return (
    <div className={className}>
      <div className="left">
        <img src={images.login} />
      </div>
      <div className="right">
        <div>
          <Button onClick={window.preload.quit}>退出应用</Button>
          <Button
            onClick={() => {
              window.preload.loginSuccess({ token: "123" });
            }}
          >
            登录成功
          </Button>
        </div>
      </div>
    </div>
  );
}

export default styled(Login)`
  height: 100vh;
  width: 100vw;
  display: flex;

  .left {
    flex: 1;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: top;
    }
  }

  .right {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
