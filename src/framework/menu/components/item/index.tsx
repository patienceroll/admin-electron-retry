import React from "react";
import styled, { useTheme } from "styled-components";
import { useSpring, animated } from "@react-spring/web";

import useWather from "src/hooks/use-wather";

function Item(
  props: StyledWrapComponents<{
    item: UserMenu;
    darkMode: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }>
) {
  const { className, item, onClick } = props;
  const theme = useTheme();
  const [hovered] = useWather();

  const style = useSpring(
    Object.assign(
      { config: { tension: 150, friction: 20 } },
      hovered.whether
        ? {
            boxShadow: "none",
            borderColor: theme.colorPrimary,
          }
        : {
            boxShadow: "0 2px 4px 1px #4b4b590a",
            borderColor: "transparent",
          }
    )
  );

  return (
    <animated.div
      onClick={onClick}
      className={className}
      onMouseEnter={hovered.setTrue}
      onMouseLeave={hovered.setFalse}
      style={style}
    >
      {item.name}
    </animated.div>
  );
}

export default styled(Item)`
  display: inline-block;
  text-align: center;
  height: 46px;
  line-height: 46px;
  width: 150px;
  box-sizing: border-box;
  border-width: 1px;
  user-select: none;
  cursor: pointer;
  font-size: 13px;
  color: ${(props) => props.theme.colorText};
  border-style: solid;
  margin-top: ${(props) => props.theme.margin}px;
  margin-right: ${(props) => props.theme.margin}px;
  border-radius: ${(props) => props.theme.borderRadius}px;
  background-image: linear-gradient(
    133deg,
    ${(props) => (props.darkMode ? props.theme.colorBgContainer : "#fafbff")} 0%,
    ${(props) => (props.darkMode ? props.theme.colorBgContainer : "#fff")}
      28%,
    ${(props) => (props.darkMode ? props.theme.colorBgContainer : "#fff")}
      100%
  );
`;
