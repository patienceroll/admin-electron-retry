import React, { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  FloatButton,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from "@ant-design/pro-components";

import Search from "src/framework/component/search";
import PageWrapper from "src/framework/component/page-wrapper";
import SearchAction from "src/framework/component/search/search-action";

import useSearchTable from "src/hooks/use-search-table";
import useColumnState from "src/hooks/use-column-state";
import useOption from "src/hooks/use-option";
import styled, { useTheme } from "styled-components";

//主体接口
import {
  getPurchaseReceiveList,
  purchaseReceiveStatus,
} from "src/apps/admin/api/purchase-receive";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";
import { BusinessOpportunityStatus } from "src/apps/admin/api/business-opportunity";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";
import useStaffTree from "src/b-hooks/use-staff-tree";
import usePageTableHeight from "src/hooks/use-page-table-height";
import contextedMessage from "src/framework/component/contexted-message";
import Permission from "src/util/permission";
import { purchaseReturnExport } from "src/apps/admin/api/purchase-return";
import Icon from "src/framework/component/icon";
import ExportSvg from "src/assets/svg/导出.svg";
import openWindow from "src/util/open-window";
function PurchaseReceiveList() {
  const table = useSearchTable(getPurchaseReceiveList);
  const theme = useTheme();
  const { options, treeOptions } = useStaffTree();
  const isCompact = window.preload.getTheme().layout === "compact";
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 4 : 14)
  );
  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);
  const [salesContractOption] = useOption(getSalesContractOption);
  const [salesOrderOption] = useOption(getSalesOrderOption);

  const column = table.column([
    {
      title: "收货单",
      dataIndex: "code",
      copyable: true,
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          copyable
          onClick={() => {
            openWindow.openCurrentAppWindow(
              `/purchase/purchase-receive/detail?id=${record.id}`,
              "采购收货详情 - " + record.code
            );
          }}
        >
          {record.code}
        </Typography.Link>
      ),
    },
    {
      title: "收货日期",
      dataIndex: "bill_date",
      renderText: (_, row) => row.bill_date,
    },
    {
      title: "供应商",
      dataIndex: "supplier",
      renderText: (_, row) => row.supplier?.name,
    },
    {
      title: "采购合同",
      dataIndex: "purchase_contract_name",
      renderText: (_, row) => row.purchase_contract?.name,
    },
    {
      title: "合同编号",
      dataIndex: "purchase_contract_code",
      renderText: (_, row) => row.purchase_contract?.code,
    },
    {
      title: "采购申请",
      dataIndex: "purchase_apply_code",
      renderText(_, row) {
        return row.purchase_apply?.code;
      },
    },
    {
      title: "采购订单",
      dataIndex: "purchase_order_code",
      renderText(_, row) {
        return row.purchase_order?.code;
      },
    },
    {
      title: "项目",
      dataIndex: "project",
      renderText(_, row) {
        return row.project?.name_show;
      },
    },
    {
      title: "合同",
      dataIndex: "sales_contract_name",
      renderText(_, row) {
        return row.sales_contract?.name;
      },
    },
    {
      title: "销售订单",
      dataIndex: "sales_order_code",
      renderText(_, row) {
        return row.sales_order?.code;
      },
    },
    {
      title: "金额",
      dataIndex: "amount",
      valueType: "money",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "负责人",
      dataIndex: "staff",
      renderText: (_, row) => row.staff?.name,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: purchaseReceiveStatus,
    },
    {
      dataIndex: "id",
      title: "操作",
      fixed: "right",
      width: 200,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={() => {
                contextedMessage.message?.info("正在开发中...");
              }}
            >
              打印
            </Button>
          </Space>
        );
      },
    },
  ]);

  const columnState = useColumnState("purchaseReceiveList", column);

  useEffect(() => {
    table.reload();
    projectOption.loadOption();
    clientOption.loadOption();
    salesContractOption.loadOption();
    salesOrderOption.loadOption();
    options.loadOption();
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
                placeholder="合同名称/编号搜索"
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect<Project>
                label="项目"
                name="project_ids"
                mode="multiple"
                showSearch
                options={projectOption.list}
                fieldProps={{
                  loading: projectOption.loading,
                  optionFilterProp: "name_show",
                  fieldNames: { label: "name_show", value: "id" },
                }}
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect<Client>
                label="客户"
                name="client_ids"
                mode="multiple"
                showSearch
                options={clientOption.list}
                fieldProps={{
                  loading: clientOption.loading,
                  optionFilterProp: "name_show",
                  fieldNames: { label: "name_show", value: "id" },
                }}
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect<SalesContract>
                label="合同"
                name="sales_contract_ids"
                mode="multiple"
                showSearch
                options={salesContractOption.list}
                fieldProps={{
                  loading: salesContractOption.loading,
                  optionFilterProp: "name",
                  fieldNames: { label: "name", value: "id" },
                }}
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect<SalesOrder>
                label="订单"
                name="sales_order_ids"
                mode="multiple"
                showSearch
                options={salesOrderOption.list}
                fieldProps={{
                  loading: salesOrderOption.loading,
                  optionFilterProp: "code",
                  fieldNames: { label: "code", value: "id" },
                }}
              />
            </Col>
            <Col flex="280px">
              <ProFormTreeSelect
                label="负责人"
                name="staff_ids"
                placeholder="请选择负责人"
                fieldProps={{ treeData: treeOptions, multiple: true }}
              />
            </Col>

            <Col flex="320px">
              <ProFormDateRangePicker
                name="bill_date"
                transform={(value) => ({
                  start_time: value[0],
                  end_time: value[1],
                })}
                label="退料日期"
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
        scroll={{
          x: table.measureColumnWidth(columnState.widthColumn),
          y: height,
        }}
        columnsState={{
          value: columnState.data?.data,
          onChange: columnState.onChange,
        }}
        components={{
          header: {
            cell: columnState.tableHeaderCellRender,
          },
        }}
        headerTitle={
          <Tabs
            items={[{ value: -1, text: "全部" }]
              .concat(Array.from(BusinessOpportunityStatus.values()))
              .map((i) => ({
                key: `${i.value}`,
                label: i.text,
              }))}
            onChange={(e) => {
              const status =
                e === `-1`
                  ? undefined
                  : (e as unknown as PurchaseReceive["status"]);
              table.extraParams.current.status = status;
              table.params.current.page = 1;
              table.reload();
            }}
          />
        }
      />

      <FloatButton.Group shape="square">
        {Permission.getPermission("export") && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            description="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              purchaseReturnExport(
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

export default styled(PurchaseReceiveList)``;
