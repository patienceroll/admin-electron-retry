import React from "react";
import styled, { useTheme } from "styled-components";
import { animated, useSpring } from "@react-spring/web";

import FileSvg from "src/assets/svg/文件.svg";
import Icon from "src/framework/component/icon";

function Item(
  props: StyledWrapComponents<
    { item: FolderFile } & React.DelHTMLAttributes<HTMLDivElement>
  >
) {
  const { className, item, ...restProps } = props;
  const theme = useTheme();

  const [style, api] = useSpring(() => ({
    scale: 1, // 原始大小
    backgroundColor: "transparent",
    config: { mass: 1, tension: 160, friction: 20 }, // 配置动画参数
  }));

  return (
    <animated.div
      className={className}
      style={{ backgroundColor: style.backgroundColor }}
      {...restProps}
      onMouseOver={function () {
        api.start({ scale: 1.1, backgroundColor: theme.colorBgTextHover });
      }}
      onMouseLeave={function () {
        api.start({ scale: 1, backgroundColor: "transparent" });
      }}
    >
      <animated.div className="inner" style={{ scale: style.scale }}>
        <Icon icon={FileSvg} width={34} height={34} />
        <div className="name">{item.name}</div>
      </animated.div>
    </animated.div>
  );
}

export default styled(Item)`
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100px;

  .inner {
    text-align: center;
  }

  .name {
    height: 48px;
    line-height: 24px;
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
  }
`;
