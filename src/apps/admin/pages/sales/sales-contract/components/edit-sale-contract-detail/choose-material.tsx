import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Button, Col, Form, Input, Modal, Row, Select, Space } from "antd";
import styled, { useTheme } from "styled-components";
import ProTable from "@ant-design/pro-table";

import useWather from "src/hooks/use-wather";
import useSearchTable from "src/hooks/use-search-table";
import { getMaterialSku } from "src/apps/admin/api/sales-contract";
import useOption from "src/hooks/use-option";
import { getMaterialClassifyOptions } from "src/apps/admin/api/marterial-classify";
import useTableInnerHeight from "src/hooks/use-page-table-height/use-table-inner-height";
import * as AttrSearch from "src/b-components/attr-search";

type Ref = {
  choose: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const ChooseMaterial = forwardRef<Ref, StyledWrapComponents>(function (
  props,
  ref
) {
  const promiseResolver = useRef<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm();

  const table = useSearchTable(getMaterialSku);
  const [classify] = useOption(getMaterialClassifyOptions);

  const attrSearch = AttrSearch.createRef();

  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    choose() {
      return new Promise<void>((resolve, reject) => {
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
        classify.loadOption().then((value) => {
          const item = value.find((i) => i.name === "成品-1");
          if (item) {
            form.setFieldsValue({ material_classify_id: item.id });
            table.extraParams.current.material_classify_id = item.id;
            attrSearch.current?.changeAttr({ material_classify_id: item.id });
          }
        });
      });
    },
  }));

  const column = table.column([
    {
      title: "产品",
      fixed: "left",
      dataIndex: "material",
      renderText: (_, row) => row.material?.name,
      ellipsis: true,
    },
    {
      title: "外径",
      renderText: (_, row) => row.o_diameter,
    },
    {
      title: "壁厚",
      renderText: (_, row) => row.wall_thickness,
    },
    {
      title: "内涂层厚度",
      renderText: (_, row) => row.i_coat_thickness,
    },
    {
      title: "外涂层厚度",
      renderText: (_, row) => row.o_coat_thickness,
    },
    {
      title: "长度",
      renderText: (_, row) => row.length,
    },
    {
      title: "连接方式",
      renderText: (_, row) => row.connection_type,
    },
    {
      title: "钢卷类型",
      renderText: (_, row) => row.steel_type,
    },
    {
      title: "材质",
      renderText: (_, row) => row.texture,
    },
    {
      title: "内涂层颜色",
      renderText: (_, row) => row.i_coat_color,
    },
    {
      title: "外涂层颜色",
      renderText: (_, row) => row.o_coat_color,
    },
    {
      title: "拓展属性",
    },
  ]);

  const height = "60vh";
  const tableInnerHeight = useTableInnerHeight();

  return (
    <Modal
      width="100vw"
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={open.setFalse}
      footer={null}
      styles={{ body: { height } }}
      className={props.className}
    >
      <Row wrap={false} gutter={[theme.padding, theme.padding]} className="row">
        <Col flex="340px" className="col">
          <Form form={form} className="form">
            <Form.Item
              className="shrink"
              label="分类"
              name="material_classify_id"
            >
              <Select<MaterialClassify["id"]>
                options={classify.list}
                fieldNames={{ label: "name", value: "id" }}
                filterOption
                showSearch
                optionFilterProp="name"
                placeholder="请选择分类"
                onChange={(e) => {
                  attrSearch.current?.changeAttr({
                    material_classify_id: e,
                  });
                }}
              />
            </Form.Item>

            <Form.Item className="shrink" label="物资" name="material_name">
              <Input placeholder="请输入物资" />
            </Form.Item>

            <Form.Item className="shrink" label="规格" name="material_mode">
              <Input placeholder="请输入规格" />
            </Form.Item>

            <div className="attr-container">
              <Form.Item name="attr_ids">
                <AttrSearch.default ref={attrSearch} />
              </Form.Item>
            </div>
            <div className="action">
              <Space>
                <Button type="primary">查询</Button>
              </Space>
              <Space>
                <Button>关闭</Button>
                <Button type="primary">保存</Button>
              </Space>
            </div>
          </Form>
        </Col>
        <Col flex={1}>
          <ProTable
            rowKey="id"
            search={false}
            loading={table.loading}
            options={table.options}
            dataSource={table.dataSource}
            pagination={table.pagination}
            onChange={table.onChange}
            columns={column}
            style={{
              height: `calc(${height} - ${theme.padding}px)`,
            }}
            scroll={{
              x: table.measureColumnWidth(column),
              y: `calc(${height} - ${theme.padding + tableInnerHeight}px)`,
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
});

export default styled(ChooseMaterial)`
  .form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .row {
    height: 100%;
  }

  .col {
    height: 100%;
  }

  .shrink {
    flex-shrink: 0;
  }

  .attr-container {
    flex: 1;
    margin-bottom: ${({ theme }) => theme.margin}px;
    overflow-y: auto;
  }

  .action {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
  }
`;
