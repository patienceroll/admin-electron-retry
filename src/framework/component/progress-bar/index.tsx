import { animated, useSpring } from "@react-spring/web";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import controler from "./controler";
import useUpdate from "src/hooks/use-update";
import useWather from "src/hooks/use-wather";

// ms
const barIntevalLength = 5000;
/** 当触发 finished 的时候,结束动画时常 ms  */
const finishDuration = 300;

function ProgressBar(props: StyledWrapComponents) {
  const { className } = props;

  const width = useRef(0);
  const animationFrame = useRef<number>();
  const [status, setStatus] = useState<"start" | "finished">("start");

  const [update] = useUpdate();
  const [show] = useWather();

  const style = useSpring({
    height: 2,
    width: `${width.current}%`,
    config: {
      tension: 250,
      friction: 20,
      duration: status === "start" ? 16.6666 : finishDuration,
    },
  });

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
          width.current = 0
        }, finishDuration);
      }
    }
    controler.linsten(listen);
    return () => {
      controler.remove(listen);
    };
  }, []);

  return show.whether &&  <animated.div className={className} style={style} />;
}

export default styled(ProgressBar)`
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${(props) => props.theme.colorPrimary};
  z-index: 10000;
  width: 100%;
`;
