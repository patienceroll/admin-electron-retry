import styled, { useTheme } from "styled-components";
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
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components/es";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  businessOpportunityExport,
  BusinessOpportunityStatus,
  deleteBusinessOpportunity,
  getBusinessOpportunityList,
} from "src/apps/admin/api/business-opportunity";
import useColumnState from "src/hooks/use-column-state";
import SearchAction from "src/framework/component/search/search-action";
import Search from "src/framework/component/search";
import useOption from "src/hooks/use-option";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { watherMap } from "src/apps/admin/api/general";
import AddressFormSearch from "src/framework/component/adress-form-search";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import ExportSvg from "src/assets/svg/导出.svg";
import contextedMessage from "src/framework/component/contexted-message";
import openWindow from "src/util/open-window";
import contextedModal from "src/framework/component/contexted-modal";
import * as Create from "./components/create";
import usePageTableHeight from "src/hooks/use-page-table-height";
import images from "src/assets/images";

function BusinessOpportunity() {
  const table = useSearchTable(getBusinessOpportunityList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";

  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 0 : 8),
  );

  const create = Create.createRef();

  const [area] = useOption(getAreaOption);

  const column = table.column([
    {
      title: "业务机会",
      dataIndex: "name_show",

      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            const window = openWindow.openCurrentAppWindow(
              `/business-opportunity/business-opportunity/detail?id=${record.id}`,
              "业务机会详情 - " + record.name_show,
            );

            function listener(
              event: MessageEvent<keyof BusinessOpportunity["btn_power"]>,
            ) {
              if (
                [
                  "is_approve",
                  "is_submit",
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
          {record.name}
        </Typography.Link>
      ),
    },
    {
      title: "标识",
      dataIndex: "mark_icon",
      render: (_, record) => (
        <Space>
          {record.is_importance === 1 && (
            <img src={images.red_star} alt="重点" />
          )}
          {record.is_approve === 1 && (
            <img src={images.approval} alt="审批中" />
          )}
        </Space>
      ),
    },
    {
      title: "编号",
      dataIndex: "code",
      fixed: "left",
      copyable: true,
    },
    {
      title: "类别",
      dataIndex: "category",
    },
    {
      title: "行业",
      dataIndex: "trade",
    },
    {
      title: "建设内容",
      dataIndex: "build_content",
      width: 200,
    },
    {
      title: "地址",
      dataIndex: "address",
    },
    {
      title: "区域",
      dataIndex: "area",
      renderText(_, row) {
        return row.area?.name;
      },
    },
    {
      title: "总投资金额",
      dataIndex: "investment_amount",
      valueType: "money",
    },
    {
      title: "中标金额",
      dataIndex: "win_bid_amount",
      valueType: "money",
    },
    {
      title: "机会价值",
      dataIndex: "estimated_amount",
      valueType: "money",
    },
    {
      title: "挂网时间",
      dataIndex: "hang_time",
    },
    {
      title: "开标时间",
      dataIndex: "bid_open_time",
    },
    {
      title: "采购时间",
      dataIndex: "purchase_date",
    },
    {
      title: "信息完善度",
      dataIndex: "perfect_ratio",
      valueType: "progress",
    },
    {
      title: "项目状态",
      dataIndex: "project_status",
    },
    {
      title: "状态",
      dataIndex: "status",

      valueEnum: BusinessOpportunityStatus,
    },
    {
      title: "负责人",
      dataIndex: "staff",
      renderText(_, row) {
        return row.staff?.name;
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
    },
    {
      title: "操作",
      dataIndex: "action",
      fixed: "right",
      width: 160,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={function () {
                const window = openWindow.openCurrentAppWindow(
                  `/business-opportunity/business-opportunity/edit?id=${row.id}`,
                  `编辑 - ${row.name_show}`,
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
                    return deleteBusinessOpportunity({ id: row.id }).then(
                      () => {
                        contextedMessage.message?.success("成功删除");
                        table.reload();
                      },
                    );
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

  const columnState = useColumnState("businessOpportunityList", column);

  useEffect(() => {
    table.reload();
    area.loadOption();
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
                placeholder="按业务机会/编号搜索"
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect<Area>
                label="区域"
                name="area_ids"
                options={area.list}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  showSearch: true,
                  filterOption: true,
                  optionFilterProp: "name",
                  mode: "multiple",
                }}
              />
            </Col>
            <Col flex="560px">
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
            <Col flex="160px">
              <ProFormCheckbox.Group
                name="is_importance"
                label="重点"
                options={Array.from(watherMap.values()).map((item) => ({
                  label: item.text,
                  value: item.value,
                }))}
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
              .concat(Array.from(BusinessOpportunityStatus.values()))
              .map((i) => ({
                key: `${i.value}`,
                label: i.text,
              }))}
            onChange={(e) => {
              const status =
                e === `-1`
                  ? undefined
                  : (e as unknown as BusinessOpportunity["status"]);
              table.extraParams.current.status = status;
              table.params.current.page = 1;
              table.reload();
            }}
          />
        }
      />

      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建机会"
          icon={<Icon icon={AddSvg} />}
          onClick={() => {
            create.current?.create().then((result) => {
              contextedMessage.message?.success("成功新增");
              table.reload();
              const window = openWindow.openCurrentAppWindow(
                `/business-opportunity/business-opportunity/edit?id=${result.id}`,
                "编辑业务机会",
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
          "/business-opportunity/business-opportunity",
          "export",
        ) && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            tooltip="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              businessOpportunityExport(
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

export default styled(BusinessOpportunity)``;
