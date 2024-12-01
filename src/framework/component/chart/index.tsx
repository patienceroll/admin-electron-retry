import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { BarChart, LineChart, PieChart, TreeChart } from "echarts/charts";
import {
  DataZoomComponent,
  // 数据集组件
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TreeChart,
  DataZoomComponent,
]);

type Ref = {
  getInstance: () => Promise<echarts.EChartsType>;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<
  Ref,
  Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "ref"
  >
>(function (props, ref) {
  const div = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts>();

  useEffect(() => {
    function listener() {
      chart.current?.resize();
    }

    const observer = new ResizeObserver(listener);

    if (div.current) {
      chart.current = echarts.init(div.current);
      observer.observe(div.current, {});
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getInstance() {
      return new Promise((res, rej) => {
        if (chart.current) {
          res(chart.current);
        } else {
          rej("暂未获取到实例");
        }
      });
    },
  }));

  return <div ref={div} {...props} />;
});
