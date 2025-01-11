import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Form, Select } from "antd";

import { getMaterialsAttrList } from "src/apps/admin/api/material";

type Ref = {
  changeAttr: (options: {
    material_classify_id: MaterialClassify["id"];
    material_sku_id?: MaterialSku["id"];
  }) => Promise<MaterialOfAttr["id"][]>;
};

type Props = {
  value?: MaterialOfAttr["id"][];
  onChange?: (value: MaterialOfAttr["id"][]) => void;
};

export function createRef() {
  return useRef<Ref>(null);
}

export default forwardRef<Ref, Props>(function (props, ref) {
  const { value = [], onChange = () => {} } = props;
  const [attrs, setAttrs] = useState<MaterialOfAttr[]>([]);

  useImperativeHandle(ref, () => ({
    changeAttr(options) {
      return new Promise<MaterialOfAttr["id"][]>((resolve, reject) => {
        getMaterialsAttrList(options).then((res) => {
          setAttrs(res.data);
          const newValue: MaterialOfAttr["id"][] = [];
          res.data.map((item) => {
            item.detail.forEach((item) => {
              if (item.is_select) {
                newValue.push(item.id);
              }
            });
          });
          onChange(newValue);
          resolve(newValue)
        }).catch(reject);
      });
    },
  }));

  return attrs.map((attr) => {
    const current = value.filter((v) =>
      attr.detail.find((item) => item.id === v)
    );
    return (
      <Form.Item label={attr.name}>
        <Select
          mode="multiple"
          options={attr.detail}
          fieldNames={{
            label: "value",
            value: "id",
          }}
          value={current}
          optionFilterProp="value"
          placeholder="请选择"
          onChange={(e) => {
            if (e.length > current.length) {
              onChange(Array.from(new Set(value.concat(e))));
            } else {
              const removed = current.filter((i) => !e.includes(i));
              onChange(value.filter((i) => !removed.includes(i)));
            }
          }}
        />
      </Form.Item>
    );
  });
});
