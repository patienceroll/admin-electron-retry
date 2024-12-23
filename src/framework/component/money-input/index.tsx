import React from "react";
import { InputNumber, InputNumberProps } from "antd";

export default function (props: InputNumberProps) {
  const {
    formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    parser = (value) => value!.replace(/\$\s?|(,*)/g, ""),
    style = { width: "100%" },
    prefix = "¥",
    max = 9999999999.999,
    placeholder = "请输入",
  } = props;
  return (
    <InputNumber
      {...props}
      formatter={formatter}
      parser={parser}
      prefix={prefix}
      style={style}
      max={max}
      placeholder={placeholder}
    />
  );
}
