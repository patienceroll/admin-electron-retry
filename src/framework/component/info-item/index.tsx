import React, { isValidElement } from "react";
import styled from "styled-components";

function InfoItem(
  props: React.PropsWithChildren<
    StyledWrapComponents<{
      label: React.ReactNode;
      labelWidth?: React.CSSProperties["width"];
      contentClass?: string;
      contentStyle?: React.CSSProperties;
    }>
  >
) {
  const { className, label, children, labelWidth = 100, contentStyle } = props;
  return (
    <div className={className}>
      {isValidElement(label) ? (
        label
      ) : (
        <span className="label" style={{ width: labelWidth }}>
          {label}:
        </span>
      )}
      {isValidElement(children) ? (
        children
      ) : (
        <span
          className={`content ${props.contentClass || ""}`}
          style={contentStyle}
        >
          {children}
        </span>
      )}
    </div>
  );
}

export default styled(InfoItem)`
  display: flex;

  .label {
    color: ${(props) => props.theme.colorTextTertiary};
    text-align: right;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    color: ${(props) => props.theme.colorText};
    padding-left: ${(props) => props.theme.padding}px;
  }
`;
