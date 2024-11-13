import React, { useEffect } from "react";

import { useSpring, animated } from "@react-spring/web";

function FadeInWrapper(props: React.DelHTMLAttributes<HTMLDivElement>) {
  const { children, style, ...restProps } = props;

  const { opacity } = useSpring({
    opacity: 1, // 目标透明度为 1，即完全不透明
    from: { opacity: 0 }, // 初始透明度为 0，即完全透明
    config: { duration: 300 }, // 淡入动画持续时间为 1000ms
  });

  useEffect(() => {
    opacity.reset();
  }, [children, opacity]);

  return (
    <animated.div
      {...restProps}
      style={Object.assign(style || {}, { opacity })}
    >
      {children}
    </animated.div>
  );
}

export default FadeInWrapper;
