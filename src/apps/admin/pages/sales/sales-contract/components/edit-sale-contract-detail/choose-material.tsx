import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  TreeSelect,
} from "antd";
import styled, { useTheme } from "styled-components";
import ProTable, { ProColumns } from "@ant-design/pro-table";

import useWather from "src/hooks/use-wather";
import useSearchTable from "src/hooks/use-search-table";
import {
  getMaterialSku,
  postMaterialSku,
  salesContractMaterialRender,
} from "src/apps/admin/api/sales-contract";
import { materialClassifyTree } from "src/apps/admin/api/marterial-classify";
import useTableInnerHeight from "src/hooks/use-page-table-height/use-table-inner-height";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import { getMaterialsAttrList } from "src/apps/admin/api/material";

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

  const promiseResolver = useRef<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [loading] = useWather();
  const [form] = Form.useForm<typeof table.extraParams.current>();

  const table = useSearchTable(getMaterialSku);
  const [select, setSelect] = useState<SalesContractMaterialSku[]>([]);
  const [tree, setTree] = useState<MaterialClassifyTree[]>([]);
  const [attrs, setAttrs] = useState<MaterialOfAttr[]>([]);

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

  function getClassify() {
    return materialClassifyTree().then((res) => {
      setTree(res.data);
    });
  }

  function getAttr(options: {
    material_classify_id: MaterialClassify["id"];
    material_sku_id?: MaterialSku["id"];
  }) {
    return getMaterialsAttrList(options).then((res) => {
      setAttrs(res.data);
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


  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    choose() {
      return new Promise<void>((resolve, reject) => {
        open.setTrue();
        form.resetFields();
        promiseResolver.current = { resolve, reject };
        getClassify();
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
              <TreeSelect
                showSearch
                treeData={tree}
                placeholder="请选择分类"
                treeNodeFilterProp="name"
                fieldNames={{
                  label: "name",
                  value: "id",
                  children: "child",
                }}
                onChange={(e) => {
                  getAttr({
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
              {attrs.map((item) => (
                <Form.Item label={item.name} name={item.key} key={item.key}>
                  <Select
                    mode="multiple"
                    options={item.detail}
                    fieldNames={{
                      label: "value",
                      value: "id",
                    }}
                    optionFilterProp="value"
                    placeholder="请选择"
                  />
                </Form.Item>
              ))}
            </div>
            <div className="action">
              <Space>
                <Button
                  onClick={() => {
                    form.resetFields();
                    table.extraParams.current = form.getFieldsValue();
                    getRenderNames(form.getFieldsValue());
                    table.reload();
                  }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    table.extraParams.current = form.getFieldsValue();
                    getRenderNames(form.getFieldsValue());
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
