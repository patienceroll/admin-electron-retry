import React, { useEffect } from "react";
import { Affix, Card, Col, Row, Typography } from "antd";
import {
  ProForm,
  ProFormCheckbox,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from "@ant-design/pro-components";

import Search from "src/framework/component/search";
import PageWrapper from "src/framework/component/page-wrapper";
import SearchAction from "src/framework/component/search/search-action";
import AddressFormSearch from "src/framework/component/adress-form-search";

import useSearchTable from "src/hooks/use-search-table";
import useColumnState from "src/hooks/use-column-state";

import openWindow from "src/util/open-window";
import { watherMap } from "src/apps/admin/api/general";
import styled, { useTheme } from "styled-components";

//主体接口
import { getSalesContractList } from "src/apps/admin/api/sales-contract";
//关联接口
import { StaffStatus } from "src/apps/admin/api/client";
import { BusinessOpportunityStatus } from "src/apps/admin/api/business-opportunity";

function SalesContract() {
  const table = useSearchTable(getSalesContractList);
  const theme = useTheme();

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
      title: "编号",
      dataIndex: "code",
      fixed: "left",
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
      valueEnum: StaffStatus,
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

  const columnState = useColumnState("salesContractlist", column);

  useEffect(() => {
    table.reload();
  }, []);

  return (
    <PageWrapper>
      <Affix offsetTop={theme.padding}>
        <Card bordered>
          <Search>
            <Row gutter={[theme.padding, theme.padding]}>
              <Col flex="220px">
                <ProFormText
                  label="关键词"
                  name="keyword"
                  placeholder="合同名称/编号搜索"
                />
              </Col>
              <Col flex="220px">
                <ProFormSelect<Area>
                  label="区域"
                  name="area_ids"
                  // options={area.list}
                  // fieldProps={{
                  //   fieldNames: { label: "name", value: "id" },
                  //   showSearch: true,
                  //   filterOption: true,
                  //   optionFilterProp: "name",
                  //   mode: "multiple",
                  // }}
                />
              </Col>
              <Col flex="330px">
                <ProFormSelect<Project>
                  label="项目"
                  name="project_ids"
                  mode="multiple"
                  showSearch
                  // options={projectOption.list}
                  // fieldProps={{
                  //   loading: projectOption.loading,
                  //   optionFilterProp: "name_show",
                  //   fieldNames: { label: "name_show", value: "id" },
                  // }}
                />
              </Col>
              <Col flex="330px">
                <ProFormSelect<Client>
                  label="客户"
                  name="client_ids"
                  mode="multiple"
                  showSearch
                  // options={clientOption.list}
                  // fieldProps={{
                  //   loading: clientOption.loading,
                  //   optionFilterProp: "name_show",
                  //   fieldNames: { label: "name_show", value: "id" },
                  // }}
                />
              </Col>
              <Col flex="220px">
                <ProFormSelect
                  label="类型"
                  name="types"
                  mode="multiple"
                  showSearch
                  // options={salesContractType}
                  // fieldProps={{
                  //   fieldNames: {
                  //     label: "text",
                  //     value: "value",
                  //   },
                  // }}
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
              <Col flex="220px">
                <ProFormSelect<Area>
                  label="状态"
                  name="statuses"
                  options={Array.from(BusinessOpportunityStatus.values())}
                  fieldProps={{
                    fieldNames: { label: "text", value: "value" },
                    showSearch: true,
                    filterOption: true,
                    optionFilterProp: "name",
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
              <Col flex="220px">
                <ProFormTreeSelect
                  label="负责人"
                  name="staff_ids"
                  placeholder="请选择负责人"
                  // fieldProps={{ treeData: staffTreeData, multiple: true }}
                />
              </Col>
              <Col flex="220px">
                <SearchAction
                  loading={table.loading}
                  onReset={table.onReset}
                  onFinish={table.onFinish}
                />
              </Col>
            </Row>
          </Search>
        </Card>
      </Affix>
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
