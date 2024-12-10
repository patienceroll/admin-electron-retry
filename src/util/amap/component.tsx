import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import amap from "src/util/amap";

type Ref = {
  getMap: () => Promise<AMap.Map>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Component = forwardRef<Ref, React.HtmlHTMLAttributes<HTMLDivElement>>(
  function (props, ref) {
    const div = useRef<HTMLDivElement>(null);
    const mapIstance = useRef<AMap.Map>();

    useImperativeHandle(ref, () => ({
      async getMap() {
        if (mapIstance.current) return mapIstance.current;
        if (!div.current) throw new Error("没有地图容器元素");
        const am = await amap.getAmap();
        mapIstance.current = new am.Map(div.current, {
          center: [106.55, 29.57],
          zoom: 6,
          mapStyle: "amap://styles/normal",
          features: ["bg", "building", "point"],
          zoomEnable: true,
        });
        return mapIstance.current;
      },
    }));

    return <div {...props} ref={div} />;
  }
);

export default styled(Component)``;
