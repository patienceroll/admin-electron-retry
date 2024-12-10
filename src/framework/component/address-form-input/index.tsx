import { Input, InputRef } from "antd";
import React, { useRef } from "react";
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

function AddressFormInput(
  props: Omit<InputProps, "value" | "onChange"> & {
    outRef?: React.RefObject<InputRef>;
  } & {
    value?: Value;
  }
) {
  const { value, outRef, ...rest } = props;
  const _inputRef = useRef<InputRef>(null);
  const inputRef = outRef || _inputRef;
  const chooseAddressRef = ChooseAddress.createRef();

  return (
    <>
      <Input
        {...rest}
        ref={inputRef}
        value={value?.address}
        onFocus={function (e) {
          if (rest.onFocus) {
            rest.onFocus(e);
          }
          inputRef.current?.blur();
          chooseAddressRef.current?.choose().then((res) => {});
        }}
      />
      <ChooseAddress.default ref={chooseAddressRef} />
    </>
  );
}

export default styled(AddressFormInput)``;
