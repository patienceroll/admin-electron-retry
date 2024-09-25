import React from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

${(props) => 123}
`;

export default function() {
  return <GlobalStyle />
};
