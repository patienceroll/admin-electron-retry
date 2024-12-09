import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "antd";

export default function (props: PropsWithChildren) {
  const { token } = theme.useToken();

  return <ThemeProvider theme={token}>{props.children}</ThemeProvider>;
}
