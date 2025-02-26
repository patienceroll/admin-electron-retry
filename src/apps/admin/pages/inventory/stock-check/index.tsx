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
  deleteStockCheck,
  getStockCheckList,
  stockCheckStatus,
  stockCheckType,
} from "src/apps/admin/api/stock-check";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";
import useStaffTree from "src/b-hooks/use-staff-tree";
import usePageTableHeight from "src/hooks/use-page-table-height";
import openWindow from "src/util/open-window";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import * as Create from "./components/create";
import Permission from "src/util/permission";
function StockCheck() {
  const table = useSearchTable(getStockCheckList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 4 : 14)
  );
  const { options, treeOptions } = useStaffTree();
  const create = Create.createRef();

  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);
  const [salesContractOption] = useOption(getSalesContractOption);
  const [salesOrderOption] = useOption(getSalesOrderOption);

  function Edit(id: StockCheck["id"]) {
    const window = openWindow.openCurrentAppWindow(
      `/inventory/stock-check/edit?id=${id}`,
      "编辑盘点单"
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

  const column = table.column([
    {
      title: "盘点单",
      dataIndex: "code",
      copyable: true,
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          copyable
          onClick={() => {
            const window = openWindow.openCurrentAppWindow(
              `/inventory/stock-check/detail?id=${record.id}`,
              "盘点单详情 - " + record.code
            );

            function listener(
              event: MessageEvent<keyof SalesContract["btn_power"]>
            ) {
              if (
                [
                  "is_submit",
                  "is_approve",
                  "is_end",
                  "is_invalid",
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
      width: 260,
    },
    {
      title: "类型",
      dataIndex: "type",
      valueEnum: stockCheckType,
    },
    {
      title: "盘点目标",
      dataIndex: "target_show",
      width: 120,
      ellipsis: true,
    },
    {
      title: "单据日期",
      dataIndex: "bill_date",
      width: 120,
      search: {
        transform(value) {
          return {
            start_time: value[0],
            end_time: value[1],
          };
        },
      },
      ellipsis: true,
      render: (_, row) => row.bill_date,
    },
    {
      title: "计划开始时间",
      dataIndex: "plan_start_time",
      width: 120,
      ellipsis: true,
    },
    {
      title: "计划结束时间",
      dataIndex: "plan_finish_time",
      width: 120,
      ellipsis: true,
    },
    {
      title: "开始时间",
      dataIndex: "start_time",
      width: 120,
      ellipsis: true,
    },
    {
      title: "结束时间",
      dataIndex: "finish_time",
      width: 120,
      ellipsis: true,
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
      valueEnum: stockCheckStatus,
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
            <Button
              type="text"
              onClick={function () {
                Edit(row.id);
              }}
            >
              编辑
            </Button>
            <Button
              type="text"
              danger
              onClick={function () {
                contextedModal.modal?.confirm({
                  title: "删除",
                  content: `确定删除${row.code}?`,
                  onOk() {
                    return deleteStockCheck({ id: row.id }).then(() => {
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

  const columnState = useColumnState("stockCheckList", column);

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
                label="发货日期"
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
              .concat(Array.from(stockCheckStatus.values()))
              .map((i) => ({
                key: `${i.value}`,
                label: i.text,
              }))}
            onChange={(e) => {
              const status =
                e === `-1` ? undefined : (e as unknown as StockCheck["status"]);
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
            description="新盘点单"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              create.current?.create().then((result) => {
                contextedMessage.message?.success("成功新增");
                table.reload();
                Edit(result.id);
              });
            }}
          />
        )}
      </FloatButton.Group>
      <Create.default ref={create} />
    </PageWrapper>
  );
}

export default styled(StockCheck)``;
