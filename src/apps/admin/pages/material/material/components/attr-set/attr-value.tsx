import { Button, Input, Space, Tag } from "antd";
import React, { useState } from "react";
import { useTheme } from "styled-components";

type Value = Pick<MaterialAttr["detail"][number], "value">[];

export default function (props: {
  value?: Value;
  onChange?: (value: Value) => void;
}) {
  const { value = [], onChange = () => {} } = props;
  const [input, setInput] = useState("");
  const theme = useTheme();
  const handleAdd = () => {
    if (!value.find((item) => item.value === input)) {
      onChange(value.concat({ value: input }));
    }
    setInput("");
  };

  return (
    <div>
      <Space>
        <Input
          placeholder="属性值,回车保存"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd();
            }
          }}
        />
        <Button type="primary" onClick={handleAdd}>
          添加
        </Button>
      </Space>
      {value.map((item) => (
        <Tag
          key={item.value}
          closable
          color={theme.colorPrimary}
          style={{ marginTop: theme.margin, marginRight: theme.margin }}
          onClose={(e) => {
            e.preventDefault();
            onChange(value.filter((v) => v.value !== item.value));
          }}
        >
          {item.value}
        </Tag>
      ))}
    </div>
  );
}
