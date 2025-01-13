import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Col, Form, Input, Modal, Row, Select, Space } from "antd";
import styled, { useTheme } from "styled-components";
import ProTable, { ProColumns } from "@ant-design/pro-table";

import useWather from "src/hooks/use-wather";
import useSearchTable from "src/hooks/use-search-table";
import {
  getMaterialSku,
  postMaterialSku,
  salesContractMaterialRender,
} from "src/apps/admin/api/sales-contract";
import useOption from "src/hooks/use-option";
import { getMaterialClassifyOptions } from "src/apps/admin/api/marterial-classify";
import useTableInnerHeight from "src/hooks/use-page-table-height/use-table-inner-height";
import * as AttrSearch from "src/b-components/attr-search";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";

type Ref = {
  choose: () => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const ChooseMaterial = forwardRef<
  Ref,
  StyledWrapComponents<Pick<SalesContract, "id">>
>(function (props, ref) {
  const { id } = props;
  const isCompact = window.preload.getTheme().layout === "compact";

  const promiseResolver = useRef<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm<typeof table.extraParams.current>();

  const table = useSearchTable(getMaterialSku);
  const [classify] = useOption(getMaterialClassifyOptions);
  const [select, setSelect] = useState<SalesContractMaterialSku[]>([]);

  const [renderNames, setRenderNames] = useState<RenderConfig>({
    attr_fields: [],
    unit_fields: [],
  });

  function getRenderNames(
    params: Parameters<typeof salesContractMaterialRender>[0]
  ) {
    salesContractMaterialRender(params).then((res) => {
      setRenderNames(res.data);
    });
  }

  const attrColumn = useMemo(() => {
    return renderNames.attr_fields.map<ProColumns<SalesContractMaterialSku>>(
      (item) => ({
        title: item.name,
        renderText: (_, row) => row[item.key as keyof SalesContractMaterialSku],
      })
    );
  }, [renderNames.attr_fields]);

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
            getRenderNames({ material_classify_id: item.id });
            attrSearch.current
              ?.changeAttr({ material_classify_id: item.id })
              .then(() => form.getFieldsValue())
              .then((res) => {
                table.extraParams.current = res;
                table.reload();
              });
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
    ...attrColumn,
  ]);

  const height = "60vh";
  const tableInnerHeight = useTableInnerHeight({ alert: true });

  function submit() {
    if (select.length === 0) {
      contextedMessage.message?.warning("请至少选择一个物资");
    } else {
      let value = "";

      contextedModal.modal?.confirm({
        title: "请输入执行标准",
        content: (
          <Input
            placeholder="请输入执行标准"
            onChange={(e) => {
              value = e.target.value;
            }}
          />
        ),
        onOk() {
          loading.setTrue();
          return postMaterialSku({
            id,
            ids: select.map((item) => item.id),
            standard: value,
          })
            .then(() => {
              promiseResolver.current.resolve();
              open.setFalse();
            })
            .finally(loading.setFalse);
        },
      });
    }
  }

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
                  getRenderNames({ material_classify_id: e });
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
                <Button
                  type="primary"
                  onClick={() => {
                    table.extraParams.current = form.getFieldsValue();
                    table.reload();
                  }}
                >
                  查询
                </Button>
              </Space>
              <Space>
                <Button onClick={open.setFalse} disabled={loading.whether}>
                  关闭
                </Button>
                <Button
                  type="primary"
                  onClick={submit}
                  loading={loading.whether}
                >
                  保存
                </Button>
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
              height: height,
            }}
            scroll={{
              x: table.measureColumnWidth(column),
              y: `calc(${height} - ${tableInnerHeight}px)`,
            }}
            rowSelection={{
              selectedRowKeys: select.map((i) => i.id),
              preserveSelectedRowKeys: true,
              type: "checkbox",
              fixed: "left",
              alwaysShowAlert: true,
              onChange(_, rows) {
                setSelect(rows);
              },
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
