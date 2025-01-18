import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import {
  Button,
  Card,
  Col,
  FloatButton,
  Row,
  Space,
  Tree,
  TreeDataNode,
} from "antd";
import ProTable from "@ant-design/pro-table";
import { ProFormText, ProFormTreeSelect } from "@ant-design/pro-form";

import PageWrapper from "src/framework/component/page-wrapper";
import { materialClassifyTree } from "src/apps/admin/api/marterial-classify";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import FixAttrSet from "src/assets/svg/维护属性.svg";
import * as AttrSet from "./components/attr-set";
import * as ClassifyModify from "./components/classify-modify";
import * as MaterailCreate from "./components/material-create";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";
import useSearchTable from "src/hooks/use-search-table";
import {
  deleteMaterial,
  getMaterialList,
  materialExport,
} from "src/apps/admin/api/material";
import usePageTableHeight from "src/hooks/use-page-table-height";
import useColumnState from "src/hooks/use-column-state";
import { watherMap } from "src/apps/admin/api/general";
import ExportSvg from "src/assets/svg/导出.svg";
import contextedMessage from "src/framework/component/contexted-message";
import openWindow from "src/util/open-window";
import contextedModal from "src/framework/component/contexted-modal";

interface ClassifyItem extends TreeDataNode {
  _item: MaterialClassifyTree;
}

function Materail(props: StyledWrapComponents) {
  const { className } = props;
  const theme = useTheme();

  const [classify, setClassify] = useState<ClassifyItem[]>();
  const [tree, setTree] = useState<MaterialClassifyTree[]>([]);

  const attrSet = AttrSet.createRef();
  const classifyModify = ClassifyModify.createRef();
  const materailCreate = MaterailCreate.createRef();

  const table = useSearchTable(getMaterialList);

  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );

  function getClassify() {
    materialClassifyTree().then((res) => {
      setTree(res.data);

      function recusion(item: MaterialClassifyTree): ClassifyItem {
        return {
          _item: item,
          key: item.id,
          selectable: false,
          checkable: false,
          title: () => (
            <Space>
              <span>{item.name}</span>
              <Button
                type="text"
                size="small"
                onClick={() => {
                  classifyModify.current?.edit(item).then(() => {
                    getClassify();
                  });
                }}
              >
                编辑
              </Button>
              <Button type="text" danger size="small">
                删除
              </Button>
            </Space>
          ),
          children: item.child ? item.child.map((c) => recusion(c)) : undefined,
        };
      }

      setClassify(res.data.map(recusion));
    });
  }

  useEffect(() => {
    getClassify();
    table.reload();
  }, []);

  const column = table.column([
    {
      title: "一级大类",
      dataIndex: "first_classify_name",
      renderText(_, row) {
        return row.first_classify?.name;
      },
    },
    {
      title: "二级大类",
      dataIndex: "second_classify_name",
      renderText(_, row) {
        return row.second_classify?.name;
      },
    },
    {
      title: "类别",
      dataIndex: "classify_name",
      renderText(_, row) {
        return row.classify?.name;
      },
    },
    {
      title: "物资",
      dataIndex: "name",
    },
    {
      title: "编码",
      dataIndex: "code",
    },
    {
      title: "品牌",
      dataIndex: "brand",
    },
    {
      title: "型号",
      dataIndex: "model",
    },
    {
      title: "主单位",
      dataIndex: "unit",
    },
    {
      title: "仓库",
      dataIndex: "warehouse",
      renderText(_, row) {
        return row.warehouse?.name;
      },
    },
    {
      title: "启用",
      dataIndex: "status",
      valueEnum: watherMap,
    },
    {
      title: "操作",
      width: 200,
      fixed: "right",
      dataIndex: "action",
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              disabled={row.btn_power.is_edit !== 1}
              onClick={() => {
                onEditMaterail(row.id);
              }}
            >
              编辑
            </Button>
            {row.status === 1 && (
              <Button
                type="text"
                danger
                onClick={() => {
                  contextedMessage.message?.info("该功能暂未开放");
                }}
              >
                停用
              </Button>
            )}
            {row.status === 0 && (
              <Button
                type="text"
                onClick={() => {
                  contextedMessage.message?.info("该功能暂未开放");
                }}
              >
                启用
              </Button>
            )}
            <Button
                type="text"
                danger
                disabled={row.btn_power.is_delete !== 1}
                onClick={() => {
                  contextedModal.modal?.confirm({
                    title: "删除",
                    content: `确定删除${row.name}?`,
                    onOk() {
                      return deleteMaterial({ id: row.id }).then(() => {
                        contextedMessage.message?.success("成功删除");
                        table.reload();
                      });
                    },
                  });
                }}
              >
                删除
              </Button>
          </Space>
        );
      },
    },
  ]);

  const columnState = useColumnState("material", column);

  function onEditMaterail(id: Material["id"]) {
    const window = openWindow.openCurrentAppWindow(
      `/material/material/edit?id=${id}`,
      "编辑物资"
    );
    function listener(event: MessageEvent<"success">) {
      if (event.data === "success") {
        table.reload();
        contextedMessage.message?.success("编辑成功");
      }
    }
    if (window) {
      window.addEventListener("message", listener);
    }
  }

  return (
    <PageWrapper className={className}>
      <Row gutter={theme.padding} wrap={false}>
        <Col flex="300px">
          <Card
            bordered
            className="classify"
            styles={{
              body: {
                overflowY: "auto",
                height: `calc(100vh - ${theme.padding * 2}px)`,
              },
            }}
          >
            <Tree<ClassifyItem> showLine treeData={classify} />
          </Card>
        </Col>
        <Col flex={1}>
          <Card
            bordered
            ref={(div) => {
              if (div) addAElement(div);
            }}
          >
            <Search>
              <Row gutter={[theme.padding, theme.padding]}>
                <Col flex="280px">
                  <ProFormTreeSelect
                    label="分类"
                    name="material_classify_id"
                    placeholder="按分类搜索"
                    fieldProps={{
                      treeData: tree,
                      treeNodeFilterProp: "name",
                      showSearch: true,
                      fieldNames: {
                        label: "name",
                        value: "id",
                        children: "child",
                      },
                    }}
                  />
                </Col>
                <Col flex="280px">
                  <ProFormText
                    label="关键词"
                    name="keyword"
                    placeholder="按关键词搜索"
                  />
                </Col>
                <Col flex="80px">
                  <SearchAction
                    loading={table.loading}
                    onReset={table.onReset}
                    onFinish={table.onFinish}
                  />
                </Col>
              </Row>
            </Search>
          </Card>

          <ProTable
            rowKey="id"
            style={{ marginTop: theme.margin }}
            search={false}
            loading={table.loading}
            options={table.options}
            dataSource={table.dataSource}
            pagination={table.pagination}
            onChange={table.onChange}
            columns={columnState.column}
            scroll={{ x: table.measureColumnWidth(column), y: height }}
            columnsState={{
              value: columnState.data?.data,
              onChange: columnState.onChange,
            }}
            components={{
              header: {
                cell: columnState.tableHeaderCellRender,
              },
            }}
          />
        </Col>
      </Row>
      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建物资"
          icon={<Icon icon={AddSvg} />}
          onClick={() => {
            materailCreate.current?.create().then((res) => {
              table.reload();
              onEditMaterail(res.id);
            });
          }}
        />
        <FloatButton
          tooltip="新建分类"
          icon={<Icon icon={AddSvg} />}
          onClick={() => {
            classifyModify.current?.create().then(() => {
              getClassify();
            });
          }}
        />
        <FloatButton
          tooltip="维护属性"
          icon={<Icon icon={FixAttrSet} />}
          onClick={() => {
            attrSet.current?.set();
          }}
        />
        {window.preload.getLocalUserHasPermission(
          "/material/material",
          "export"
        ) && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            tooltip="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              materialExport(
                Object.assign(
                  {},
                  table.params.current,
                  table.extraParams.current
                )
              ).then((res) => {
                window.preload.downloadFile(res.data.file_path);
              });
            }}
          />
        )}
      </FloatButton.Group>
      <AttrSet.default ref={attrSet} />
      <ClassifyModify.default classifies={tree} ref={classifyModify} />
      <MaterailCreate.default classifies={tree} ref={materailCreate} />
    </PageWrapper>
  );
}

export default styled(Materail)`
  .classify {
    height: calc(100vh - ${(props) => props.theme.padding * 2}px);
  }
`;
