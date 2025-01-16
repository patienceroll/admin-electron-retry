import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Checkbox, Col, Form, Modal, Row, Space } from "antd";
import styled, { useTheme } from "styled-components";
import ProTable from "@ant-design/pro-table";
import { ProFormText } from "@ant-design/pro-form";

import useWather from "src/hooks/use-wather";
import useOption from "src/hooks/use-option";
import {
  getMaterialAttrs,
  putMaterialAttrs,
} from "src/apps/admin/api/material-attr";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import useTableInnerHeight from "src/hooks/use-page-table-height/use-table-inner-height";
import { watherMap } from "src/apps/admin/api/general";
import AttrValue from "./attr-value";

type Ref = {
  set: () => void;
};

export function createRef() {
  return useRef<Ref>(null);
}

type Current = {
  detail: Pick<MaterialAttr["detail"][number], "value">[];
  id: MaterialAttr["id"];
  name: MaterialAttr["name"];
};

const AttrSet = forwardRef<Ref, StyledWrapComponents>(function (props, ref) {
  const { className } = props;

  const [form] = Form.useForm<Pick<Current, "detail" | "name">>();
  const [current, setCurrent] = useState<Current>();

  const [open] = useWather();
  const [saving] = useWather();
  const theme = useTheme();

  const [attrs] = useOption(getMaterialAttrs);

  useImperativeHandle(ref, () => ({
    set() {
      open.setTrue();
      attrs.loadOption();
      setCurrent(undefined);
      form.resetFields()
    },
  }));

  function save() {
    form
      .validateFields()
      .then((store) => {
        saving.setTrue();
        return putMaterialAttrs({
          id: current!.id,
          ...store,
        });
      })
      .then(() => {
        attrs.load();
      })
      .finally(saving.setFalse);
  }

  const column = tableColumn<MaterialAttr>([
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "启用",
      dataIndex: "status",
      valueEnum: watherMap,
    },
    {
      title: "编辑",
      dataIndex: "action",
      render(_, row) {
        return (
          <Checkbox
            checked={current?.id === row.id}
            onChange={(e) => {
              if (e.target.checked) {
                setCurrent(row);
                form.setFieldsValue({
                  name: row.name,
                  detail: row.detail.map((item) => ({ value: item.value })),
                });
              }
            }}
          />
        );
      },
    },
  ]);

  const height = "60vh";
  const tableInnerHeight = useTableInnerHeight({
    toolbar: false,
    pagenation: false,
  });

  return (
    <Modal
      title="属性维护"
      className={className}
      open={open.whether}
      footer={null}
      onCancel={open.setFalse}
      width={800}
      styles={{ body: { height } }}
    >
      <Row gutter={theme.padding} wrap={false}>
        <Col flex={1}>
          <ProTable
            columns={column}
            search={false}
            pagination={false}
            options={false}
            dataSource={attrs.list}
            loading={attrs.loading}
            style={{
              height: height,
            }}
            scroll={{
              x: tableMeasureColumnWidth(column),
              y: `calc(${height} - ${tableInnerHeight}px)`,
            }}
          />
        </Col>
        <Col flex="300px">
          <div className="form-container" style={{ height }}>
            <Form form={form} style={{ flex: 1, overflowY: "auto" }}>
              <ProFormText
                label="属性名"
                name="name"
                placeholder="请输入属性名"
                rules={[{ required: true, message: "请输入属性名" }]}
              />
              <Form.Item
                label="属性值"
                name="detail"
                rules={[{ required: true, message: "请输入属性值" }]}
              >
                <AttrValue />
              </Form.Item>
            </Form>

            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={open.setFalse}>关闭</Button>
                <Button
                  type="primary"
                  disabled={!current}
                  loading={saving.whether}
                  onClick={save}
                >
                  保存
                </Button>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
});

export default styled(AttrSet)`
  .form-container {
    display: flex;
    flex-direction: column;
  }
`;
