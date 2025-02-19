import React, { useEffect } from "react";
import { Button, Card, Col, FloatButton, Row, Space } from "antd";
import {
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import styled, { useTheme } from "styled-components";

import PageWrapper from "src/framework/component/page-wrapper";
import Search from "src/framework/component/search";
import usePageTableHeight from "src/hooks/use-page-table-height";
import SearchAction from "src/framework/component/search/search-action";
import useSearchTable from "src/hooks/use-search-table";

import useColumnState from "src/hooks/use-column-state";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";
import openWindow from "src/util/open-window";
import Permission from "src/util/permission";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import ExportSvg from "src/assets/svg/导出.svg";
import {
  deleteSupplierContact,
  getSupplierContactList,
  supplierContactExport,
  SupplierContactStatus,
} from "src/apps/admin/api/supplier-contact";
import { watherMap } from "src/apps/admin/api/general";
import useOption from "src/hooks/use-option";
import { getSupplierOption } from "src/apps/admin/api/supplier";

function SupplierContact() {
  const theme = useTheme();

  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );

  const table = useSearchTable(getSupplierContactList);
  const [supplier] = useOption(getSupplierOption);

  const column = table.column([
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "供应商",
      dataIndex: "supplier",
      renderText(_, row) {
        return row.supplier?.name_show;
      },
      ellipsis: true,
    },
    {
      title: "职位",
      dataIndex: "job_title",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "微信",
      dataIndex: "wechat",
    },
    {
      title: "身份证号",
      dataIndex: "ID_card",
    },
    {
      title: "重要联系人",
      dataIndex: "is_main",
      valueEnum: watherMap,
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "statuses",
      valueEnum: SupplierContactStatus,
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
                    return deleteSupplierContact({ id: row.id }).then(() => {
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
      `/supplier/supplier-contact/edit?id=${id}`,
      "编辑供应商联系人"
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
    supplier.loadOption();
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
            <Col flex="350px">
              <ProFormSelect<Supplier>
                label="供应商"
                name="supplier_ids"
                options={supplier.list}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  showSearch: true,
                  filterOption: true,
                  optionFilterProp: "name",
                  mode: "multiple",
                }}
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
            description="新联系人"
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
            description="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              supplierContactExport(
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

export default styled(SupplierContact)``;
