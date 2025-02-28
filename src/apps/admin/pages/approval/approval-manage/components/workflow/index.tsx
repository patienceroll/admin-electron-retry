import { Button, Select, Space, StepProps, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components";

import { getStaffOption } from "src/apps/admin/api/staff";
import useOption from "src/hooks/use-option";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import DeleteSvg from "src/assets/svg/delete.svg";

export default function (props: {
  value?: Staff["id"][];
  onChange?: (value: Staff["id"][]) => void;
}) {
  const { value = [], onChange = () => {} } = props;

  const theme = useTheme();

  const [staff] = useOption(getStaffOption);
  const [tempid, setTempid] = useState<Staff["id"]>();

  useEffect(() => {
    staff.loadOption();
  }, [staff]);

  return (
    <Steps
      current={-1}
      direction="vertical"
      items={value
        .map<StepProps>((id, index) => ({
          status: "process",
          description: (
            <Space>
              <Select
                style={{ width: "200px" }}
                value={id}
                options={staff.list.map((o) => ({
                  label: o.name,
                  value: o.id,
                  disabled: value.includes(o.id),
                }))}
                placeholder="请选择审批人"
                onChange={(e) => {
                  onChange(value.map((v, i) => (i === index ? e : v)));
                }}
              />

              <Button
                type="primary"
                danger
                onClick={() => {
                  onChange(value.filter((v) => v !== id));
                }}
                icon={<Icon icon={DeleteSvg} fill={theme.colorWhite} />}
              />
            </Space>
          ),
        }))
        .concat({
          status: "wait",
          description: (
            <Space>
              <Select
                style={{ width: "200px" }}
                value={tempid}
                options={staff.list.map((o) => ({
                  label: o.name,
                  value: o.id,
                  disabled: value.includes(o.id),
                }))}
                placeholder="请选择审批人"
                onChange={setTempid}
              />
              <Button
                type="primary"
                disabled={!tempid}
                onClick={() => {
                  onChange([...value, tempid!]);
                  setTempid(undefined);
                }}
                icon={<Icon icon={AddSvg} fill={theme.colorWhite} />}
              />
            </Space>
          ),
        })}
    />
  );
}
