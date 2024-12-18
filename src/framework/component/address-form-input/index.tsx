import { Input, InputRef } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import { InputProps } from "antd/lib";

import * as ChooseAddress from "src/framework/component/choose-address";

type Value = {
  province: string;
  city: string;
  county: string;
  latitude: number;
  longitude: number;
  address: string;
};

const AddressFormInput = forwardRef(function (
  props: Omit<InputProps, "value" | "onChange"> & {} & {
    value?: Value;
    onChange?: (value: Value) => void;
  },
  ref
) {
  const {
    value,
    className,
    placeholder = "请点击然后在地图上搜索地址",
    onChange,
    ...rest
  } = props;
  const inputRef = useRef<InputRef>(null);

  const chooseAddressRef = ChooseAddress.createRef();

  useImperativeHandle(ref, () => {});

  return (
    <>
      <Input
        {...rest}
        ref={inputRef}
        className={className}
        value={value?.address}
        placeholder={placeholder}
        onFocus={function (e) {
          if (rest.onFocus) {
            rest.onFocus(e);
          }
          inputRef.current?.blur();
          chooseAddressRef.current?.choose(value).then((res) => {
            onChange?.(res);
          });
        }}
      />
      <ChooseAddress.default ref={chooseAddressRef} />
    </>
  );
});

export default styled(AddressFormInput)`
  cursor: pointer;
`;
