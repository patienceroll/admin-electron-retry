import React from "react";
import { theme } from "antd";
import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

 * {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.colorPrimary};
      border-radius: 4px;
      opacity: 0.3;
    }

    &::-webkit-scrollbar-track {
      background-color: ${(props) => props.theme.colorPrimaryBg};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-corner {
      display: none;
    } 
}
`;

export default GlobalStyle;
