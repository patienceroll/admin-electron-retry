import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import intervalQuery from "src/util/interval-query";
import getAmap from "src/util/amap";

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
      getMap() {
        return new Promise<AMap.Map>((resolve, reject) => {
          if (mapIstance.current) {
            resolve(mapIstance.current);
          } else {
            intervalQuery({
              condition() {
                return Boolean(div.current);
              },
              async onSuccess() {
                try {
                  const am = await getAmap();
                  mapIstance.current = new am.Map(div.current!, {
                    center: [106.55, 29.57],
                    zoom: 6,
                    mapStyle: "amap://styles/normal",
                    features: ["bg", "building", "point"],
                    zoomEnable: true,
                  });
                  resolve(mapIstance.current);
                } catch (err) {
                  reject(err);
                }
              },
              onError(err) {
                reject(err);
              },
            });
          }
        });
      },
    }));

    return <div {...props} ref={div} />;
  }
);

export default styled(Component)`
  .amap-logo,
  .amap-copyright {
    display: none !important;
  }
`;
