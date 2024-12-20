import React, { useContext } from "react";
import { Button, Space } from "antd";

import { searchContext } from "./index";

export default function <Value = any>(props: {
  onFinish: (store: Value) => Promise<void>;
  onReset: VoidFunction;
  loading: boolean;
}) {
  const { onReset, loading, onFinish } = props;

  const { form } = useContext(searchContext);

  return (
    <Space>
      <Button
        disabled={loading}
        onClick={() => {
          form.resetFields();
          onReset();
        }}
      >
        重置
      </Button>
      <Button
        type="primary"
        onClick={() => {
          onFinish(form.getFieldsValue());
        }}
        loading={loading}
      >
        查询
      </Button>
    </Space>
  );
}
