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
  ProForm,
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
  deleteSalesOrder,
  getSalesOrderList,
  salesOrderExport,
  salesOrderStatus,
} from "src/apps/admin/api/sales-order";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";

import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import AddressFormSearch from "src/framework/component/adress-form-search";
import images from "src/assets/images";
import usePageTableHeight from "src/hooks/use-page-table-height";
import useStaffTree from "src/b-hooks/use-staff-tree";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import ExportSvg from "src/assets/svg/导出.svg";
import Permission from "src/util/permission";
import * as Create from "./components/create";
import openWindow from "src/util/open-window";

function SalesOrder() {
  const table = useSearchTable(getSalesOrderList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";

  const [areaOption] = useOption(getAreaOption);
  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);
  const [salesContractOption] = useOption(getSalesContractOption);
  const create = Create.createRef();

  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 4 : 14),
  );
  const { options, treeOptions } = useStaffTree();

  const column = table.column([
    {
      title: "订单号",
      dataIndex: "name",
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            const window = openWindow.openCurrentAppWindow(
              `/sales/sales-order/detail?id=${record.id}`,
              "销售订单详情 - " + record.code,
            );

            function listener(
              event: MessageEvent<keyof SalesOrder["btn_power"]>,
            ) {
              if (
                [
                  "is_approve",
                  "is_submit",
                  "is_cancel",
                  "is_suspend",
                  "is_invalid",
                  "is_end",
                  "is_cancel_operate",
                ].includes(event.data)
              ) {
                table.reload();
              }
            }

            if (window) {
              window.addEventListener("message", listener);
            }
          }}
        >
          {record.code}
        </Typography.Link>
      ),
    },
    {
      title: "标识",
      dataIndex: "mark_icon",
      render: (_, record) => (
        <Space>
          {record.is_approve === 1 && (
            <img src={images.approval} alt="审批中" />
          )}
          {record.is_urgent === 1 && <img src={images.urgent} alt="加急" />}
          {record.is_delay === 1 && <img src={images.overdue} alt="逾期" />}
        </Space>
      ),
    },
    {
      title: "项目",
      dataIndex: "project",
      renderText(_, row) {
        return row.project?.name_show;
      },
    },
    {
      title: "客户",
      dataIndex: "client",
      renderText(_, row) {
        return row.client?.name_show;
      },
    },
    {
      title: "合同",
      dataIndex: "sales_contract_code",
      renderText: (_, row) => row.sales_contract?.name,
    },
    {
      title: "税率（%）",
      dataIndex: "tax_rate",
    },
    {
      title: "含税合计",
      dataIndex: "amount",
      valueType: "money",
    },
    {
      title: "去税合计",
      dataIndex: "no_tax_amount",
      valueType: "money",
    },
    {
      title: "金额",
      dataIndex: "amount",
      valueType: "money",
    },
    {
      title: "下单日期",
      dataIndex: "bill_date",
      renderText: (_, row) => row.bill_date,
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
      valueEnum: salesOrderStatus,
    },
    {
      dataIndex: "action",
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
            <Button
              type="text"
              disabled={row.btn_power.is_edit !== 1}
              onClick={function () {
                Edit(row.id);
              }}
            >
              编辑
            </Button>
            <Button
              type="text"
              danger
              disabled={row.btn_power.is_delete !== 1}
              onClick={function () {
                contextedModal.modal?.confirm({
                  title: "删除",
                  content: `确定删除${row.code}?`,
                  onOk() {
                    return deleteSalesOrder({ id: row.id }).then(() => {
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

  const columnState = useColumnState("salesOrderListList", column);

  useEffect(() => {
    table.reload();
    areaOption.loadOption();
    projectOption.loadOption();
    clientOption.loadOption();
    salesContractOption.loadOption();
    options.loadOption();
  }, []);

  function Edit(id: SalesOrder["id"]) {
    const window = openWindow.openCurrentAppWindow(
      `/sales/sales-order/edit?id=${id}`,
      "编辑销售订单",
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
              <ProFormSelect<Area>
                label="区域"
                name="area_ids"
                options={areaOption.list}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  showSearch: true,
                  filterOption: true,
                  optionFilterProp: "name",
                  mode: "multiple",
                }}
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
              <ProFormTreeSelect
                label="负责人"
                name="staff_ids"
                placeholder="请选择负责人"
                fieldProps={{ treeData: treeOptions, multiple: true }}
              />
            </Col>
            <Col flex="580px">
              <ProForm.Item
                label="行政区"
                name="region"
                transform={({ province, city, county }) => ({
                  province,
                  city,
                  county,
                })}
              >
                <AddressFormSearch />
              </ProForm.Item>
            </Col>

            <Col flex="320px">
              <ProFormDateRangePicker
                name="bill_date"
                transform={(value) => ({
                  start_time: value[0],
                  end_time: value[1],
                })}
                label="下单日期"
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
              .concat(Array.from(salesOrderStatus.values()))
              .map((i) => ({
                key: `${i.value}`,
                label: i.text,
              }))}
            onChange={(e) => {
              const status =
                e === `-1` ? undefined : (e as unknown as SalesOrder["status"]);
              table.extraParams.current.status = status;
              table.params.current.page = 1;
              table.reload();
            }}
          />
        }
      />

      <FloatButton.Group shape="square">
        {Permission.getPermission("edit") && (
          <FloatButton
            description="新建订单"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              create.current?.create().then((res) => {
                contextedMessage.message?.success("成功新增");
                table.reload();
                Edit(res.id);
              });
            }}
          />
        )}
        {Permission.getPermission("export") && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            description="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              salesOrderExport(
                Object.assign(
                  {},
                  table.params.current,
                  table.extraParams.current,
                ),
              ).then((res) => {
                window.preload.downloadFile(res.data.file_path);
              });
            }}
          />
        )}
      </FloatButton.Group>
      <Create.default ref={create} />
    </PageWrapper>
  );
}

export default styled(SalesOrder)`
  .ant-select-multiple .ant-select-selector {
    border-radius: 0 !important;
  }
`;
