import React, { PropsWithChildren } from "react";
import styled from "styled-components";

function Title(
  props: StyledWrapComponents<
    PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
  >
) {
  const { className, children, ...resetProps } = props;
  return (
    <div className={className} {...resetProps}>
      <div className="inner">{children}</div>
    </div>
  );
}
export default styled(Title)`
  height: 38px;
  line-height: 38px;
  display: flex;
  border-radius: 8px 0 0 4px;
  overflow: hidden;

  .inner {
    flex-shrink: 0;
    width: 400px;
    font-size: ${(props) => props.theme.fontSizeHeading5}px;
    font-weight: 700;
    padding-left: ${(props) => props.theme.padding}px;
    background-image: linear-gradient(
      90deg,
      ${(props) => props.theme.colorPrimaryBg},
      ${(props) => props.theme.colorPrimaryBg}00
    );
  }
`;
