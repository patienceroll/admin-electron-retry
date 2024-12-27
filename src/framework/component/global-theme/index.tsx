import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${(props) => props.theme.colorBgBase};
    color: ${(props) => props.theme.colorTextBase}
  }

 * {
    &::-webkit-scrollbar {
      width: ${(props) => props.theme.padding / 2}px;
      height: ${(props) => props.theme.padding / 2}px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.colorPrimaryBgHover};
      border-radius:  ${(props) => props.theme.padding / 4}px;
      opacity: 0.3;
    }

    &::-webkit-scrollbar-track {
      background-color: ${(props) => props.theme.colorPrimaryBg};
      border-radius:  ${(props) => props.theme.padding / 4}px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-corner {
      display: none;
    } 

}


h1,h2,h3,h4,h5,h6 {
  margin-block: 0;
  margin-inline: 0;
}

.ant-pro-table {
  .ant-table-content {
    padding-bottom: 0;
    scrollbar-color: auto;
    scrollbar-width: auto;
  }

  .ant-table-body {
    scrollbar-color: auto;
    scrollbar-width: auto;
  }

  .ant-pro-table-list-toolbar-container {
    padding-block: ${(props) => props.theme.padding - 4}px;
  }
}

.ant-pro-query-filter-row {
  row-gap: ${(props) => props.theme.padding}px;
}



`;

export default GlobalStyle;
