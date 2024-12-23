import {
  Card,
  DatePicker,
  Form,
  Input,
  TreeSelect,
  Typography,
} from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import { useTheme } from "styled-components";

import Icon from "src/framework/component/icon";
import DeleteSvg from "src/assets/svg/delete.svg";
import FlexCenter from "src/framework/component/flex-center";

type Ref = {
  validate: () => Promise<Record<string, any>>;
};

type OptionsUseForTreeSelect = {
  title?: React.ReactNode;
  value?: string | number;
  children?: OptionsUseForTreeSelect[];
  selectable?: boolean;
};

export default forwardRef<
  Ref,
  { detail: Client; staffList: OptionsUseForTreeSelect[], onDelete: VoidFunction }
>(function (props, ref) {
  const { detail, staffList, onDelete } = props;

  const theme = useTheme();

  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    validate() {
      return form.validateFields();
    },
  }));
  return (
    <Card bordered hoverable>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={5}>{detail.name}</Typography.Title>
        <FlexCenter>
          <Icon
            onClick={onDelete}
            width={16}
            height={16}
            icon={DeleteSvg}
            fill={theme.colorError}
          />
        </FlexCenter>
      </div>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        initialValues={{
          staff_id: window.preload.getLocalUser()?.staff?.id,
        }}
      >
        <Form.Item
          label="跟进人"
          name="staff_id"
          rules={[{ required: true, message: "请选择" }]}
        >
          <TreeSelect
            placeholder="请选择跟进人"
            treeNodeFilterProp="title"
            treeData={staffList}
          />
        </Form.Item>
        <Form.Item label="协同人" name="staff_ids">
          <TreeSelect
            placeholder="请选择协同人"
            treeNodeFilterProp="title"
            treeData={staffList}
            multiple
          />
        </Form.Item>
        <Form.Item
          label="计划时间"
          name="plan_time"
          rules={[{ required: true, message: "请选择" }]}
        >
          <DatePicker.RangePicker
            showTime={{
              format: "HH:mm",
              minuteStep: 30,
            }}
          />
        </Form.Item>
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: "请输入" }]}
        >
          <Input.TextArea allowClear style={{ height: 100 }} />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea allowClear style={{ height: 60 }} />
        </Form.Item>
      </Form>
    </Card>
  );
});
