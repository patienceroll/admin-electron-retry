import { animated, useSpring } from "@react-spring/web";
import React, { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import Decimal from "decimal.js";

import controler from "./controler";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

// ms
const barIntevalLength = 5000;
/** 当触发 finished 的时候,结束动画时常 ms  */
const finishDuration = 300;
// 渐变宽度百分比长度 / 2
const linearLength = 20;

function ProgressBar(props: StyledWrapComponents) {
  const { className } = props;
  const theme = useTheme();

  const width = useRef(0);
  const animationFrame = useRef<number>();
  const [linearPosition, setLinearPosition] = useState(
    () => new Decimal(-linearLength)
  );
  const [status, setStatus] = useState<"start" | "finished">("start");

  const [update] = useUpdate();
  const [show] = useWather();

  const style = useSpring({
    height: 3,
    width: `${width.current}%`,
    config: {
      tension: 250,
      friction: 20,
      duration: status === "start" ? 16.6666 : finishDuration,
    },
  });

  useEffect(() => {
    let animate: number;
    function recusion() {
      animate = requestAnimationFrame(function () {
        setLinearPosition((value) => {
          if (value.toNumber() >= 100 + linearLength) return new Decimal(-linearLength);
          return new Decimal(value.add(0.6));
        });
        recusion();
      });
    }
    if (show.whether) {
      recusion();
    }

    return function () {
      cancelAnimationFrame(animate);
    };
  }, [show.whether]);

  useEffect(() => {
    function listen(status: "start" | "finished") {
      if (status === "start") {
        if (animationFrame.current)
          cancelAnimationFrame(animationFrame.current);
        setStatus("start");
        show.setTrue();
        /** 需要增加多少次 */
        const count = (barIntevalLength / 1000) * 60;
        /** 一次多长 */
        const length = 100 / count;

        // eslint-disable-next-line no-inner-declarations
        function recusion() {
          animationFrame.current = requestAnimationFrame(() => {
            const nextLength = width.current + length;
            width.current = nextLength > 100 ? 100 : nextLength;
            update();
            recusion();
          });
        }

        recusion();
      }

      if (status === "finished") {
        if (animationFrame.current)
          cancelAnimationFrame(animationFrame.current);
        width.current = 100;
        setStatus("finished");
        setTimeout(() => {
          show.setFalse();
          width.current = 0;
        }, finishDuration);
      }
    }
    controler.linsten(listen);
    return () => {
      controler.remove(listen);
    };
  }, [show, update]);

  return show.whether ? (
    <animated.div
      className={className}
      style={{
        ...style,
        backgroundImage: `linear-gradient(to right, ${theme.colorPrimary} ${
          linearPosition.toNumber() - linearLength
        }%, ${theme.colorPrimaryHover} ${linearPosition.toNumber()}%, ${
          theme.colorPrimary
        } ${linearPosition.toNumber() + linearLength}%)`,
      }}
    />
  ) : null;
}

export default styled(ProgressBar)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
`;
