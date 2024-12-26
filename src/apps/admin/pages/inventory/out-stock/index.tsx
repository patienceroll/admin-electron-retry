import React, { useEffect } from "react";
import { Card, Col, Row } from "antd";
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
import { getOutStockList, outStockStatus } from "src/apps/admin/api/out-stock";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";

function OutStock() {
  const table = useSearchTable(getOutStockList);
  const theme = useTheme();

  const [areaOption] = useOption(getAreaOption);
  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);
  const [salesContractOption] = useOption(getSalesContractOption);
  const [salesOrderOption] = useOption(getSalesOrderOption);

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
    //                     // `/sales/sales-deliver/detail?id=${record.id}`,
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
      title: "出库单",
      dataIndex: "code",
      copyable: true,
      fixed: "left",
    },
    {
      title: "仓库",
      dataIndex: "warehouse",
      renderText(_, row) {
        return row.warehouse?.name;
      },
    },
    {
      title: "仓库",
      dataIndex: "warehouse",
      renderText(_, row) {
        return row.warehouse?.name;
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
      title: "销售合同",
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
      title: "业务",
      dataIndex: "target",
      width: 120,
    },
    {
      title: "业务编号",
      dataIndex: "target_code",
      width: 120,
    },
    {
      title: "日期",
      dataIndex: "bill_date",
      valueType: "dateTime",
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
      valueEnum: outStockStatus,
    },
    {
      dataIndex: "id",
      title: "操作",
      fixed: "right",
      width: 160,
      // render: action<OutStock>([
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
      //                 pathname: `/sales/sales-deliver/edit/${entity.id}`,
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
      //                     return deleteOutStock({ id: entity.id }).then(() => {
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

  const columnState = useColumnState("outStockList", column);

  useEffect(() => {
    table.reload();
    areaOption.loadOption();
    projectOption.loadOption();
    clientOption.loadOption();
    salesContractOption.loadOption();
    salesOrderOption.loadOption();
  }, []);

  return (
    <PageWrapper>
      {/*<Affix offsetTop={theme.padding}>*/}
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
            <Col flex="330px">
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
            <Col flex="240px">
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
            <Col flex="330px">
              <ProFormDateRangePicker
                name="bill_date"
                transform={(value) => ({
                  start_time: value[0],
                  end_time: value[1],
                })}
                label="入库日期"
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
                options={Array.from(outStockStatus.values())}
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
        //   <Tabs
        //       items={[{ value: -1, text: "全部" }, ...outStockStatus].map(
        //           (i) => ({
        //             key: `${i.value}`,
        //             label: i.text,
        //           }),
        //       )}
        //       onChange={(e) => {
        //         const status = e === `-1` ? undefined : (e as any);
        //         extraParams.current.main_status = status;
        //         onChange(
        //             { current: 1 },
        //             {},
        //             {},
        //             { action: "paginate", currentDataSource: dataSource },
        //         );
        //       }}
        //   />
        // }
        // form={{
        //   layout: "inline",
        // }}
        // toolBarRender={() => [
        //   <Button
        //       hidden={!menu.getPermission()}
        //       key={1}
        //       onClick={() => {
        //         modify.current?.create().then((result) => {
        //           message.success("新增成功");
        //           history.push({
        //             pathname: `/inventory/out-stock/edit/${result.id}`,
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
        //           const data = await outStockExport({
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

export default styled(OutStock)``;
