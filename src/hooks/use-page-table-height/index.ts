import { useCallback, useEffect, useRef } from "react";

import useUpdate from "../use-update";
import useTableInnerHeight from "./use-table-inner-height";

/**
 * 
 * @param gap 空隙的高度,比如元素之间有margin,导致不能经过元素来计算高度

 */
export default function (gap = 0) {
  const timer = useRef<NodeJS.Timeout>();

  const store = useRef<
    Map<HTMLElement, { element: HTMLElement; observe: ResizeObserver }>
  >(new Map());

  const [update] = useUpdate();
  const tableInnerHeight = useTableInnerHeight();
  const addAElement = useCallback(
    (element: HTMLElement) => {
      const ele = store.current.get(element);
      if (!ele) {
        const resizeObserver = new ResizeObserver(function () {
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(update, 300);
        });
        resizeObserver.observe(element);
        store.current.set(element, { element, observe: resizeObserver });
      }
    },
    [update]
  );

  const elementsHeight = Array.from(store.current.keys()).reduce(
    (pre, current) => pre + current.clientHeight,
    0
  );

  useEffect(() => {
    // 当所有组件挂载之后,触发一次刷新以来获取 elementsHeight
    update();
  }, [update]);

  return {
    addAElement,
    height: `calc(100vh - ${elementsHeight + gap + tableInnerHeight}px)`,
  };
}
