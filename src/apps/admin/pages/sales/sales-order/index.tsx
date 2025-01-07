import React, { useEffect } from "react";
import { Card, Col, Row, Space } from "antd";
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
  getSalesOrderList,
  salesOrderStatus,
} from "src/apps/admin/api/sales-order";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";

import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import AddressFormSearch from "src/framework/component/adress-form-search";
import images from "src/assets/images";

function SalesOrderList() {
  const table = useSearchTable(getSalesOrderList);
  const theme = useTheme();

  const [areaOption] = useOption(getAreaOption);
  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);
  const [salesContractOption] = useOption(getSalesContractOption);

  const column = table.column([
    // {
    //     title: "合同",
    //     dataIndex: "name",
    //     fixed: "left",
    //     render: (_, record) => (
    //         <Typography.Link
    //             onClick={() => {
    //                 openWindow
    //                     .openCurrentAppWindow
    //                     // `/sales/sales-contract/detail?id=${record.id}`,
    //                     // "销售合同详情 - " + record.name
    //                     ();
    //             }}
    //         >
    //             {record.name}
    //         </Typography.Link>
    //     ),
    //     width: 260,
    // },
    {
      title: "订单号",
      dataIndex: "code",
      copyable: true,
      fixed: "left",
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
      dataIndex: "id",
      title: "操作",
      fixed: "right",
      width: 160,
      // render: action<SalesOrderList>([
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
      //                     return deleteSalesOrderList({ id: entity.id }).then(() => {
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

  const columnState = useColumnState("salesOrderListList", column);

  useEffect(() => {
    table.reload();
    areaOption.loadOption();
    projectOption.loadOption();
    clientOption.loadOption();
    salesContractOption.loadOption();
  }, []);

  return (
    <PageWrapper>
      {/*<Affix offsetTop={theme.padding}>*/}
      <Card bordered>
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
                // fieldProps={{ treeData: staffTreeData, multiple: true }}
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

            <Col flex="280px">
              <ProFormSelect
                label="状态"
                name="statuses"
                options={Array.from(salesOrderStatus.values())}
                fieldProps={{
                  fieldNames: { label: "text", value: "value" },
                  showSearch: true,
                  filterOption: true,
                  optionFilterProp: "name",
                  mode: "multiple",
                }}
              />
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
      {/*</Affix>*/}
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
        //   <Button
        //       hidden={!menu.getPermission()}
        //       key={1}
        //       onClick={() => {
        //         modify.current?.create().then((result) => {
        //           message.success("新增成功");
        //           history.push({
        //             pathname: `/sales/sales-order/edit/${result.id}`,
        //           });
        //         });
        //       }}
        //   >
        //     新增
        //   </Button>,
        //   <Button
        //       key="export"
        //       hidden={!menu.getPermission({ key: "export" })}
        //       loading={exporting.whether}
        //       onClick={async () => {
        //         try {
        //           exporting.setTrue();
        //           const data = await salesOrderExport({
        //             ...params,
        //             ...extraParams.current,
        //           });
        //           window.open(data.data.file_path);
        //         } finally {
        //           exporting.setFalse();
        //         }
        //       }}
        //   >
        //     导出
        //   </Button>,
        // ]}
      />
    </PageWrapper>
  );
}

export default styled(SalesOrderList)`
  .ant-select-multiple .ant-select-selector {
    border-radius: 0 !important;
  }
`;
