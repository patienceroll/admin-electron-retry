import { Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import * as AmapComponent from "src/util/amap/component";
import useWather from "src/hooks/use-wather";

type Value = {
  province: string;
  city: string;
  county: string;
  latitude: number;
  longitude: number;
  address: string;
};

type Ref = {
  choose: () => Promise<Value>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const ChooseAddress = forwardRef<Ref, StyledWrapComponents>(function (
  props,
  ref
) {
  const { className } = props;
  const mapCom = AmapComponent.createRef();
  const promiseResolver = useRef<{
    resolve: (value: Value | PromiseLike<Value>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();

  useImperativeHandle(ref, () => ({
    choose() {
      return new Promise((resolve, reject) => {
        promiseResolver.current = { reject, resolve };
        open.setTrue();
       setTimeout(() => {
        mapCom.current?.getMap()
       }, 500);
      });
    },
  }));

  return (
    <Modal
      open={open.whether}
      title="搜索地址"
      width="50%"
      styles={{ body: { height: "50vh" } }}
      className={className}
      onCancel={() => {
        promiseResolver.current.reject()
        open.setFalse()
      }}
    >
      <AmapComponent.default ref={mapCom} className="map" />
    </Modal>
  );
});

export default styled(ChooseAddress)`
  .map {
    height: 100%;
  }
`;
