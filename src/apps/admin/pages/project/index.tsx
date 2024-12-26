import React, { useEffect } from "react";
import {
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components/es";
import { useTheme } from "styled-components";
import { Button, Card, Col, message, Row, Space, Tabs, Typography } from "antd";

import useSearchTable from "src/hooks/use-search-table";
import PageWrapper from "src/framework/component/page-wrapper";
import useColumnState from "src/hooks/use-column-state";
import openWindow from "src/util/open-window";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";
import AddressFormSearch from "src/framework/component/adress-form-search";
import useOption from "src/hooks/use-option";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { watherMap } from "src/apps/admin/api/general";
import {
  deleteProject,
  getProjectList,
  ProjectStatusMap,
} from "src/apps/admin/api/project";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import * as ProjectIntroduction from "./components/introduction";

import usePageTableHeight from "src/hooks/use-page-table-height";

export default function () {
  const projectRef = ProjectIntroduction.createRef();
  const table = useSearchTable(getProjectList);
  const theme = useTheme();

  // 14 是加了tab之后高度有变化
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + 14
  );
  const [area] = useOption(getAreaOption);
  const column = table.column([
    {
      title: "项目",
      dataIndex: "name_show",
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            openWindow.openCurrentAppWindow(
              `/project/project/detail?id=${record.id}`,
              "项目详情 - " + record.name_show
            );
          }}
        >
          {record.name}
        </Typography.Link>
      ),
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
      title: "项目状态",
      dataIndex: "project_status",
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
      width: 400,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={function () {
                const window = openWindow.openCurrentAppWindow(
                  `/project/project/edit?id=${row.id}`,
                  `编辑 - ${row.name_show}`
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
                    return deleteProject({ id: row.id }).then(() => {
                      message.success("删除成功");
                      table.reload();
                    });
                  },
                });
              }}
            >
              删除
            </Button>
            <Button
              type="text"
              danger
              onClick={function () {
                projectRef.current?.show(row.id);
              }}
            >
              简介
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
            <Col flex="300px">
              <ProFormText
                label="关键词"
                name="keyword"
                placeholder="按业务机会/编号搜索"
              />
            </Col>
            <Col flex="300px">
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

            <Col flex="200px">
              <ProFormCheckbox.Group
                name="is_importance"
                label="是否重点"
                options={Array.from(watherMap.values()).map((item) => ({
                  label: item.text,
                  value: item.value,
                }))}
              />
            </Col>

            <Col flex="550px">
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
            <Col flex="300px">
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
              .concat(Array.from(ProjectStatusMap.values()))
              .map((i) => ({
                key: `${i.value}`,
                label: i.text,
              }))}
            onChange={(e) => {
              const status =
                e === `-1` ? undefined : (e as unknown as ProjectStatus);
              table.extraParams.current.status = status;
              table.params.current.page = 1;
              table.reload();
            }}
          />
        }
      />
      <ProjectIntroduction.default ref={projectRef} />
    </PageWrapper>
  );
}
