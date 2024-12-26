import React, { useEffect } from "react";
import { Card, Col, Row, Space, Typography } from "antd";
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
  getSalesContractList,
  salesContractStatus,
  salesContractType,
} from "src/apps/admin/api/sales-contract";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { getProjectOption } from "src/apps/admin/api/project";
import images from "src/assets/images";
import AddressFormSearch from "src/framework/component/adress-form-search";

function SalesContract() {
  const table = useSearchTable(getSalesContractList);
  const theme = useTheme();

  const [areaOption] = useOption(getAreaOption);
  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);

  const column = table.column([
    {
      title: "合同",
      dataIndex: "name",
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            openWindow
              .openCurrentAppWindow
              // `/sales/sales-contract/detail?id=${record.id}`,
              // "销售合同详情 - " + record.name
              ();
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
      valueType: "dateRange",
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
      dataIndex: "id",
      title: "操作",
      fixed: "right",
      width: 160,
      // render: action<SalesContract>([
      //     {
      //         text: "打印",
      //         async onClick({ entity }) {
      //             const action = await saleContractPrint({});
      //             action.prepareToPrint(entity);
      //         },
      //     },
      //     {
      //         text: "编辑",
      //         color: action.green,
      //         btn_power: "is_edit",
      //         onClick({ entity }) {
      //             history.push({
      //                 pathname: `/sales/sales-contract/edit/${entity.id}`,
      //             });
      //         },
      //     },
      //     {
      //         text: "删除",
      //         color: action.red,
      //         btn_power: "is_delete",
      //         onClick({ entity }) {
      //             asyncConfirm({
      //                 title: "删除",
      //                 content: `确定删除${entity.name}?`,
      //                 submitting() {
      //                     return deleteSalesContract({ id: entity.id }).then(() => {
      //                         message.success("删除成功");
      //                         reload();
      //                     });
      //                 },
      //             });
      //         },
      //     },
      // ]),
    },
  ]);

  const columnState = useColumnState("salesContractList", column);

  useEffect(() => {
    table.reload();
    areaOption.loadOption();
    projectOption.loadOption();
    clientOption.loadOption();
  }, []);

  return (
    <PageWrapper>
      <Card bordered>
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
                // fieldProps={{ treeData: staffTreeData, multiple: true }}
              />
            </Col>
            <Col flex="240px">
              <ProFormSelect
                label="状态"
                name="statuses"
                options={Array.from(salesContractStatus.values())}
                fieldProps={{
                  fieldNames: { label: "text", value: "value" },
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
        // style={{ marginTop: theme.margin }}
        style={{ marginTop: "6px" }}
        search={false}
        loading={table.loading}
        options={table.options}
        dataSource={table.dataSource}
        pagination={table.pagination}
        onChange={table.onChange}
        columns={columnState.column}
        scroll={{ x: table.measureColumnWidth(column) }}
        columnsState={{
          value: columnState.data?.data,
          onChange: columnState.onChange,
        }}
        components={{
          header: {
            cell: columnState.tableHeaderCellRender,
          },
        }}
        // headerTitle={
        //     <Tabs
        //         items={[{value: -1, text: "全部"}, ...billStatus].map((i) => ({
        //             key: `${i.value}`,
        //             label: i.text,
        //         }))}
        //         onChange={(e) => {
        //             const status = e === `-1` ? undefined : (e as any);
        //             extraParams.current.status = status;
        //             onChange(
        //                 {current: 1},
        //                 {},
        //                 {},
        //                 {action: "paginate", currentDataSource: dataSource},
        //             );
        //         }}
        //     />
        // }
        // toolBarRender={() => [
        //     <Button
        //         hidden={!menu.getPermission()}
        //         key={1}
        //         onClick={() => {
        //             modify.current?.create().then((result) => {
        //                 message.success("新增成功");
        //                 history.push({
        //                     pathname: `/sales/sales-contract/edit/${result.id}`,
        //                 });
        //             });
        //         }}
        //     >
        //         新增
        //     </Button>,
        //     <Button
        //         key="export"
        //         hidden={!menu.getPermission({key: "export"})}
        //         loading={exporting.whether}
        //         onClick={async () => {
        //             try {
        //                 exporting.setTrue();
        //                 const data = await salesContractExport({
        //                     ...params,
        //                     ...extraParams.current,
        //                 });
        //                 window.open(data.data.file_path);
        //             } finally {
        //                 exporting.setFalse();
        //             }
        //         }}
        //     >
        //         导出
        //     </Button>,
        // ]}
      />
    </PageWrapper>
  );
}

export default styled(SalesContract)``;
