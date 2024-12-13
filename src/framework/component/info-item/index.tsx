import React, { isValidElement } from "react";
import styled from "styled-components";

function InfoItem(
  props: React.PropsWithChildren<
    StyledWrapComponents<{
      label: React.ReactNode;
      labelWidth?: React.CSSProperties["width"];
    }>
  >
) {
  const { className, label, children, labelWidth = 100 } = props;
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
        <span className="children">{children}</span>
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

  .children {
    flex: 1;
    color: ${(props) => props.theme.colorText};
    padding-left: ${(props) => props.theme.padding}px;
  }
`;
