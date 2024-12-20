import { Form, FormInstance, ConfigProvider } from "antd";
import React, { createContext, PropsWithChildren } from "react";

type SearchContext<T = any> = {
  form: FormInstance<T>;
};

export const searchContext = createContext<SearchContext>({ form: {} as any });

export default function (props: PropsWithChildren) {
  const { children } = props;
  const [form] = Form.useForm();
  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            itemMarginBottom: 0,
          },
        },
      }}
    >
      <searchContext.Provider value={{ form }}>
        <Form form={form}>{children}</Form>
      </searchContext.Provider>
    </ConfigProvider>
  );
}
