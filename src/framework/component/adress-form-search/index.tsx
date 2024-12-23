import { useCascaderAreaData } from "@vant/area-data";
import { Select, Space } from "antd";
import React, { useMemo } from "react";

type Value = {
  province?: string;
  city?: string;
  county?: string;
};

const areaStore = useCascaderAreaData();
const city = new Map(
  areaStore.map((province) => [province.text, province.children]),
);
const area = new Map(
  Array.from(city.values())
    .flat(1)
    .map((city) => [city?.text, city?.children]),
);

export default function AddressFormSearch(props: {
  value?: Value;
  onChange?: (value: Value) => void;
}) {
  const { value = {}, onChange = () => {} } = props;

  const cityMemo = useMemo(() => {
    if (value.province) return city.get(value.province);
    return [];
  }, [value.province]);

  const areaMemo = useMemo(() => {
    if (value.city) return area.get(value.city) || [];
    return [];
  }, [value.city]);

  return (
    <Space>
      <Select
        options={areaStore}
        value={value.province}
        allowClear
        placeholder="请选择省份"
        fieldNames={{ label: "text", value: "text" }}
        onChange={(value) => {
          onChange({ province: value });
        }}
        style={{ width: 125 }}
      />
      <Select
        value={value.city}
        options={cityMemo}
        allowClear
        placeholder="请选择城市"
        fieldNames={{ label: "text", value: "text" }}
        onChange={(city) => {
          onChange({ province: value.province, city });
        }}
        style={{ width: 125 }}
      />
      <Select
        value={value.county}
        options={areaMemo}
        allowClear
        placeholder="请选择区"
        fieldNames={{ label: "text", value: "text" }}
        onChange={(county) => {
          onChange({ province: value.province, city: value.city, county });
        }}
        style={{ width: 125 }}
      />
    </Space>
  );
}
