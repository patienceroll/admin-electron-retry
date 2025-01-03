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

import openWindow from "src/util/open-window";
import styled, { useTheme } from "styled-components";

//主体接口
import {
  deleteSalesContract,
  getSalesContractList,
  salesContractExport,
  salesContractStatus,
  salesContractType,
} from "src/apps/admin/api/sales-contract";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { getProjectOption } from "src/apps/admin/api/project";
import images from "src/assets/images";
import AddressFormSearch from "src/framework/component/adress-form-search";
import usePageTableHeight from "src/hooks/use-page-table-height";
import useStaffTree from "src/b-hooks/use-staff-tree";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import ExportSvg from "src/assets/svg/导出.svg";
import * as Create from "./components/create";

function SalesContract() {
  const table = useSearchTable(getSalesContractList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";

  const create = Create.createRef();

  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 0 : 8)
  );

  const [areaOption] = useOption(getAreaOption);
  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);
  const { options, treeOptions } = useStaffTree();

  const column = table.column([
    {
      title: "合同",
      dataIndex: "name",
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            const window = openWindow.openCurrentAppWindow(
              `/sales/sales-contract/detail?id=${record.id}`,
              "销售合同详情 - " + record.name
            );
            function listener(
              event: MessageEvent<keyof SalesContract["btn_power"]>
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
          {record.name}
        </Typography.Link>
      ),
      width: 260,
    },
    {
      title: "标识",
      dataIndex: "mark_icon",
      render: (_, record) => (
        <Space>
          {record.is_factory_dispatch === 1 && (
            <img src={images.dispatch} alt="厂家配送" />
          )}
          {record.is_approve === 1 && (
            <img src={images.approval} alt="审批中" />
          )}
          {record.type === 2 && <img src={images.replenish} alt="补充协议" />}
        </Space>
      ),
    },
    {
      title: "编号",
      dataIndex: "code",
      copyable: true,
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
      title: "税率（%）",
      dataIndex: "tax_rate",
    },
    {
      title: "金额",
      dataIndex: "amount",
      valueType: "money",
    },
    {
      title: "签约日期",
      dataIndex: "sign_date",
      valueType: "date",
      renderText: (_, row) => row.sign_date,
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
      valueEnum: salesContractStatus,
    },
    {
      dataIndex: "action",
      title: "操作",
      fixed: "right",
      width: 200,
      render(_, row) {
        return (
          <Space>
            <Button type="text">打印</Button>
            <Button
              type="text"
              onClick={function () {
                const window = openWindow.openCurrentAppWindow(
                  `/sales/sales-contract/edit?id=${row.id}`,
                  `编辑 - ${row.name}`
                );

                function listener(event: MessageEvent<"success" | "delete">) {
                  if (event.data === "success") {
                    table.reload();
                    contextedMessage.message?.success("编辑成功");
                  }
                  if (event.data === "delete") {
                    table.reload();
                    contextedMessage.message?.success("删除成功");
                  }
                }
                if (window) {
                  window.addEventListener("message", listener);
                }
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
                  content: `确定删除${row.name}?`,
                  onOk() {
                    return deleteSalesContract({ id: row.id }).then(() => {
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

  const columnState = useColumnState("salesContractList", column);

  useEffect(() => {
    table.reload();
    areaOption.loadOption();
    projectOption.loadOption();
    clientOption.loadOption();
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
            <Col flex="240px">
              <ProFormText
                label="关键词"
                name="keyword"
                placeholder="合同名称/编号搜索"
              />
            </Col>
            <Col flex="240px">
              <ProFormSelect
                label="类型"
                name="types"
                mode="multiple"
                showSearch
                options={Array.from(salesContractType.values())}
                fieldProps={{
                  fieldNames: {
                    label: "text",
                    value: "value",
                  },
                }}
              />
            </Col>
            <Col flex="240px">
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
            <Col flex="330px">
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
            <Col flex="330px">
              <ProFormSelect<typeof clientOption.list>
                label="客户"
                name="client_ids"
                options={clientOption.list}
                fieldProps={{
                  fieldNames: { label: "name_show", value: "id" },
                  showSearch: true,
                  filterOption: true,
                  optionFilterProp: "name_show",
                  mode: "multiple",
                }}
              />
            </Col>
            <Col flex="500px">
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
            <Col flex="330px">
              <ProFormDateRangePicker
                name="sign_date"
                transform={(value) => ({
                  start_time: value[0],
                  end_time: value[1],
                })}
                label="签约日期"
              />
            </Col>
            <Col flex="240px">
              <ProFormTreeSelect
                label="负责人"
                name="staff_ids"
                placeholder="请选择负责人"
                fieldProps={{ treeData: treeOptions, multiple: true }}
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
        headerTitle={
          <Tabs
            items={[{ value: -1, text: "全部" }]
              .concat(Array.from(salesContractStatus.values()))
              .map((i) => ({
                key: `${i.value}`,
                label: i.text,
              }))}
            onChange={(e) => {
              const status =
                e === `-1`
                  ? undefined
                  : (e as unknown as SalesContract["status"]);
              table.extraParams.current.status = status;
              table.params.current.page = 1;
              table.reload();
            }}
          />
        }
      />

      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建合同"
          icon={<Icon icon={AddSvg} />}
          onClick={() => {
            create.current?.create().then((result) => {
              contextedMessage.message?.success("成功新增");
              table.reload();
              const window = openWindow.openCurrentAppWindow(
                `/sales/sales-contract/edit?id=${result.id}`,
                "编辑合同"
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
            });
          }}
        />

        {window.preload.getLocalUserHasPermission(
          "/sales/sales-contract",
          "export"
        ) && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            tooltip="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              salesContractExport(
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
      <Create.default ref={create} />
    </PageWrapper>
  );
}

export default styled(SalesContract)``;
