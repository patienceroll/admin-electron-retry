import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useSearchParams } from "react-router-dom";
import { Button, Card, Checkbox, Col, Form, Input, Row, Space } from "antd";
import {
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from "@ant-design/pro-form";
import ProTable from "@ant-design/pro-table";

import PageWrapper from "src/framework/component/page-wrapper";
import {
  getMaterial,
  getMaterialsAttrList,
  getMaterialSkues,
  materialRender,
  postMaterialsAttrSkues,
  postMaterialsUnit,
} from "src/apps/admin/api/material";
import Title from "src/framework/component/title";
import { materialClassifyTree } from "src/apps/admin/api/marterial-classify";
import useOption from "src/hooks/use-option";
import { getWarehouseOption } from "src/apps/admin/api/warehouse";
import BusinessFile from "src/b-components/business-file";
import key from "src/util/key";
import useWather from "src/hooks/use-wather";
import contextedMessage from "src/framework/component/contexted-message";
import useUpdate from "src/hooks/use-update";
import useSearchTable from "src/hooks/use-search-table";
import useRenderNames from "src/b-hooks/use-render-names";

type EditUnit = Pick<
  Material["units"][number],
  "unit" | "alias" | "is_main"
> & {
  key: string;
};

function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const [search] = useSearchParams(location.hash);
  const id = search.get("id") as unknown as Material["id"];
  const theme = useTheme();
  const [form] = Form.useForm();

  const [detail, setDetail] = useState<Material>();
  const [tree, setTree] = useState<MaterialClassifyTree[]>([]);
  const [warehouse] = useOption(getWarehouseOption);

  const [unit, setUnit] = useState<EditUnit[]>([]);
  const [saveUnit] = useWather();
  const [generateAttrGroup] = useWather();
  const skus = useSearchTable(getMaterialSkues);

  const [attr, setAttr] = useState<MaterialOfAttr[]>([]);
  const [checkedAttr] = useState(
    new Map<MaterialOfAttr["id"], MaterialOfAttr["detail"][number]["id"][]>()
  );
  const [update] = useUpdate();

  const [{ attrColumn, reload, }] = useRenderNames(materialRender, {
    material_id: id,
  });

  function getAttr(material_classify_id: MaterialClassify["id"]) {
    setAttr([]);
    getMaterialsAttrList({ material_classify_id }).then((res) => {
      setAttr(res.data);
    });
  }

  function getDetail() {
    getMaterial({ id }).then((res) => {
      setDetail(res.data);
      setUnit(
        res.data.units.map((item) => ({ ...item, key: key.randomString() }))
      );
      form.setFieldsValue({
        ...res.data,
        company_name: res.data.company?.name,
      });
      getAttr(res.data.material_classify_id);
    });
  }

  useEffect(() => {
    getDetail();
    materialClassifyTree().then((res) => {
      setTree(res.data);
    });
    warehouse.loadOption();
    skus.extraParams.current.status = "1";
    skus.extraParams.current.material_id = id;
    skus.reload();
    reload()
  }, [id]);

  return (
    <PageWrapper className={className}>
      <Form form={form} layout="horizontal">
        <Title>基本信息</Title>
        <Card style={{ marginTop: theme.margin }}>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="350px">
              <ProFormText label="公司" name="company_name" readonly />
            </Col>
            <Col flex="350px">
              <ProFormText
                label="名称"
                name="name"
                placeholder="请输入名称"
                rules={[{ required: true, message: "请输入名称" }]}
              />
            </Col>
            <Col flex="350px">
              <ProFormTreeSelect
                label="分类"
                name="material_classify_id"
                placeholder="请选择分类"
                tooltip="分类能决定采用哪些属性"
                fieldProps={{
                  treeData: tree,
                  treeNodeFilterProp: "name",
                  showSearch: true,
                  fieldNames: {
                    label: "name",
                    value: "id",
                    children: "child",
                  },
                  onChange: (e) => {
                    checkedAttr.clear();
                    getAttr(e);
                  },
                }}
                rules={[{ required: true, message: "请选择分类" }]}
              />
            </Col>
            <Col flex="350px">
              <ProFormText
                label="品牌"
                name="brand"
                placeholder="请输入品牌"
                rules={[{ required: true, message: "请输入品牌" }]}
              />
            </Col>
            <Col flex="350px">
              <ProFormText
                label="型号"
                name="model"
                placeholder="请输入型号"
                rules={[{ required: true, message: "请输入型号" }]}
              />
            </Col>
            <Col flex="350px">
              <ProFormSelect<Warehouse>
                label="默认仓库"
                name="warehouse_id"
                placeholder="请选择默认仓库"
                fieldProps={{
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                  fieldNames: { label: "name", value: "id" },
                }}
                options={warehouse.list}
                rules={[{ required: true, message: "请选择默认仓库" }]}
              />
            </Col>
            <Col flex="350px">
              <ProFormRadio.Group
                name="status"
                label="状态"
                rules={[{ required: true, message: "请设置状态" }]}
                options={[
                  { label: "启用", value: 1 },
                  { label: "停用", value: 0 },
                ]}
              />
            </Col>
          </Row>
        </Card>

        {/*<Title style={{ marginTop: theme.margin }}>单位设置</Title>*/}
        <Card style={{ marginTop: theme.margin }}>
          <Row>
            <Col flex="350px">
              {detail && (
                <Col flex="350px">
                  <Form.Item label="图片">
                    <BusinessFile
                      id={id}
                      service="material"
                      identify="图片"
                      isCover={1}
                      maxCount={1}
                    />
                  </Form.Item>
                </Col>
              )}
            </Col>
            <Col flex="1">
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setUnit((t) =>
                      t.concat({
                        is_main: 0,
                        unit: "",
                        alias: "",
                        key: key.randomString(),
                      })
                    );
                  }}
                >
                  新增单位
                </Button>
                <Button
                  type="primary"
                  loading={saveUnit.whether}
                  onClick={() => {
                    saveUnit.setTrue();
                    postMaterialsUnit({ id, units: unit })
                      .then(() => {
                        contextedMessage.message?.success("成功保存");
                      })
                      .finally(saveUnit.setFalse);
                  }}
                >
                  保存
                </Button>
              </Space>
              <ProTable
                search={false}
                pagination={false}
                options={false}
                dataSource={unit}
                style={{ marginTop: theme.margin }}
                columns={[
                  {
                    title: "单位",
                    dataIndex: "unit",
                    render(_, row) {
                      return (
                        <Input
                          placeholder="请输入单位"
                          value={row.unit}
                          onChange={(e) => {
                            setUnit((t) =>
                              t.map((item) => ({
                                ...item,
                                unit:
                                  item.key === row.key
                                    ? e.target.value
                                    : item.unit,
                              }))
                            );
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "别称",
                    dataIndex: "alias",
                    render(_, row) {
                      return (
                        <Input
                          placeholder="请输入单位"
                          value={row.alias}
                          onChange={(e) => {
                            setUnit((t) =>
                              t.map((item) => ({
                                ...item,
                                alias:
                                  item.key === row.key
                                    ? e.target.value
                                    : item.alias,
                              }))
                            );
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "主单位",
                    dataIndex: "is_main",
                    render(_, row) {
                      return (
                        <Checkbox
                          checked={row.is_main === 1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUnit((t) =>
                                t.map((item) => ({
                                  ...item,
                                  is_main: item.key === row.key ? 1 : 0,
                                }))
                              );
                            }
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "操作",
                    dataIndex: "action",
                    render(_, row) {
                      return (
                        <Space>
                          <Button
                            type="text"
                            danger
                            onClick={() => {
                              setUnit((t) =>
                                t.filter((item) => item.key !== row.key)
                              );
                            }}
                          >
                            删除
                          </Button>
                        </Space>
                      );
                    },
                  },
                ]}
              />
            </Col>
          </Row>
        </Card>
        <Title style={{ marginTop: theme.margin }}>属性组合</Title>
        <Card style={{ marginTop: theme.margin }}>
          <ProFormDependency name={["material_classify_id"]}>
            {() => (
              <Row gutter={[theme.padding, theme.padding]} wrap={false}>
                <Col flex="450px">
                  <Space style={{ marginBottom: theme.margin }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        checkedAttr.clear();
                        update();
                      }}
                    >
                      清空选择
                    </Button>
                    <Button
                      type="primary"
                      loading={generateAttrGroup.whether}
                      onClick={() => {
                        generateAttrGroup.setTrue();
                        const store: MaterialOfAttr[] = [];
                        Array.from(checkedAttr.keys()).forEach((attrId) => {
                          const at = attr.find((a) => a.id === attrId);
                          if (at) {
                            const newAt: MaterialOfAttr = {
                              name: at.name,
                              id: at.id,
                              detail: [],
                            };
                            store.push(newAt);
                            checkedAttr.get(at.id)?.forEach((g) => {
                              const attrValue = at.detail.find(
                                (atg) => g === atg.id
                              );
                              if (attrValue) {
                                newAt.detail.push({
                                  ...attrValue,
                                  is_select: 1,
                                });
                              }
                            });
                          }
                        });

                        postMaterialsAttrSkues({
                          id,
                          attr: store,
                        })
                          .then(() => {
                            contextedMessage.message?.success("成功生成组合");
                            skus.reload();
                            reload()
                          })
                          .finally(generateAttrGroup.setFalse);
                      }}
                    >
                      生成组合
                    </Button>
                  </Space>

                  {attr.map((item) => (
                    <div>
                      <div>{item.name}：</div>
                      <Row gutter={[theme.padding, theme.padding]}>
                        {item.detail.map((de) => {
                          const checkArray = checkedAttr.get(item.id) || [];
                          const checked = checkArray.includes(de.id);
                          return (
                            <Col flex="150px">
                              <Checkbox
                                checked={checked}
                                onChange={() => {
                                  if (checked) {
                                    checkedAttr.set(
                                      item.id,
                                      checkArray.filter((ch) => ch !== de.id)
                                    );
                                  } else {
                                    checkedAttr.set(
                                      item.id,
                                      checkArray.concat(de.id)
                                    );
                                  }
                                  update();
                                }}
                              >
                                {de.value}
                              </Checkbox>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  ))}
                </Col>
                <Col flex={1}>
                  <ProTable
                    search={false}
                    pagination={false}
                    options={skus.options}
                    dataSource={skus.dataSource}
                    loading={skus.loading}
                    columns={skus.column([
                      ...attrColumn,
                      {
                        title: "操作",
                        dataIndex: "action",
                        fixed: "right",
                        render(_, row) {
                          return (
                            <Space>
                              <Button type="text">启用</Button>
                              <Button type="text" danger>
                                停用
                              </Button>
                              <Button type="text" danger>
                                删除
                              </Button>
                            </Space>
                          );
                        },
                      },
                    ])}
                  />
                </Col>
              </Row>
            )}
          </ProFormDependency>
        </Card>
      </Form>
    </PageWrapper>
  );
}

export default styled(Edit)``;
