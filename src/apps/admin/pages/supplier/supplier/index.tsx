import React, { useEffect } from "react";
import { Button, Card, Col, FloatButton, Row, Space } from "antd";
import { ProFormText, ProTable } from "@ant-design/pro-components";
import styled, { useTheme } from "styled-components";

import PageWrapper from "src/framework/component/page-wrapper";
import Search from "src/framework/component/search";
import usePageTableHeight from "src/hooks/use-page-table-height";
import SearchAction from "src/framework/component/search/search-action";
import useSearchTable from "src/hooks/use-search-table";
import {
  deleteSupplier,
  getSupplierList,
  supplierExport,
  SupplierStatus,
} from "src/apps/admin/api/supplier";
import useColumnState from "src/hooks/use-column-state";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";
import openWindow from "src/util/open-window";
import Permission from "src/util/permission";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import ExportSvg from "src/assets/svg/导出.svg";

function Supplier() {
  const theme = useTheme();

  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );

  const table = useSearchTable(getSupplierList);

  const column = table.column([
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "简称",
      dataIndex: "short_name",
    },
    {
      title: "地址",
      dataIndex: "address",
      render(_, row) {
        return row.province + row.city + row.county + row.address;
      },
      width: 200,
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: SupplierStatus,
    },
    {
      title: "操作",
      dataIndex: "action",
      fixed: "right",
      width: 150,
      render(_, row) {
        return (
          <Space>
            <Button type="text" onClick={() => Edit(row.id)}>
              编辑
            </Button>
            <Button
              type="text"
              danger
              onClick={function () {
                contextedModal.modal?.confirm({
                  title: "删除",
                  content: `确定删除${row.name}?`,
                  onOk() {
                    return deleteSupplier({ id: row.id }).then(() => {
                      contextedMessage.message?.success("删除成功");
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

  const columnState = useColumnState("supplierList", column);

  function Edit(id: Supplier["id"]) {
    const window = openWindow.openCurrentAppWindow(
      `/supplier/supplier/edit?id=${id}`,
      "编辑供应商"
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

  useEffect(() => {
    table.reload();
  }, []);

  return (
    <PageWrapper>
      <Card
        bordered
        ref={(div) => {
          if (div) addAElement(div);
        }}
      >
        <Search>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="280px">
              <ProFormText
                label="关键词"
                name="keyword"
                placeholder="名称/简称搜索"
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
        scroll={{ x: table.measureColumnWidth(columnState.widthColumn), y: height }}
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

      <FloatButton.Group shape="square">
        {Permission.getPermission("edit") && (
          <FloatButton
            tooltip="新建供应商"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              //   create.current?.create().then((result) => {
              //     contextedMessage.message?.success("成功新增");
              //     table.reload();
              //     Edit(result.id);
              //   });
            }}
          />
        )}
        {Permission.getPermission("export") && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            tooltip="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              supplierExport(
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
    </PageWrapper>
  );
}

export default styled(Supplier)``;
