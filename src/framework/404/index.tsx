import React from "react";
import { Result } from "antd";
import styled, { useTheme } from "styled-components";
import { useLocation } from "react-router-dom";

import PageWrapper from "../component/page-wrapper";
import Icon from "src/framework/component/icon";
import Page404Svg from "src/assets/svg/404.svg";

function FC404(props: StyledWrapComponents) {
  const location = useLocation()
  const theme = useTheme();
  return (
    <PageWrapper className={props.className}>
      <Result
        className="result"
        subTitle={`您没有权限访问当前页面或者页面丢失:${location.pathname}`}
        icon={<Icon fill={theme.colorText} width={200} height={200} icon={Page404Svg} />}
      />
    </PageWrapper>
  );
}

export default styled(FC404)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
