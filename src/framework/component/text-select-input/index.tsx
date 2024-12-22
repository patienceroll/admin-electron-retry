import { Input, InputProps, List, Popover } from "antd";
import { useEffect, useState } from "react";

import useWather from "src/hooks/use-wather";
import React from "react";

export default function (
  props: Omit<InputProps, "onChange"> & {
    options: string[];
    /** event 参数暂时没有给值 */
    onChange?: (value: string, event: any) => void;
  },
) {
  const [open] = useWather();
  const [loading] = useWather();
  const [value, setValue] = useState(() => props.value);

  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value, value]);

  return (
    <Popover
      placement="top"
      style={{ paddingInline: 0 }}
      content={
        <List style={{ maxHeight: 200, overflowY: "auto", width: 150 }}>
          {props.options.map((text) => (
            <List.Item
            style={{cursor:"pointer"}}
              key={text}
              onClick={(e) => {
                setValue(text);
                props.onChange?.(text, e);
                open.setFalse();
              }}
            >
              {text}
            </List.Item>
          ))}
        </List>
      }
      open={open.whether}
    >
      <Input
        {...props}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange?.(e.target.value, e);
        }}
        onFocus={(e) => {
          props.onFocus?.(e);
          open.setTrue();
        }}
        onBlur={(e) => {
          props.onBlur?.(e);
          setTimeout(() => {
            open.setFalse();
          }, 300);
        }}
      />
    </Popover>
  );
}
