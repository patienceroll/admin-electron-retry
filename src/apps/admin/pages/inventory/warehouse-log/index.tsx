import React, { useEffect } from "react";
import { Card, Col, Row } from "antd";
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
  getWarehouseLogList,
  recordTypeMap,
} from "src/apps/admin/api/warehouse-log";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";
import AddressFormSearch from "src/framework/component/adress-form-search";

function SalesDeliver() {
  const table = useSearchTable(getWarehouseLogList);
  const theme = useTheme();

  const [areaOption] = useOption(getAreaOption);
  const [projectOption] = useOption(getProjectOption);
  const [clientOption] = useOption(getClientOption);
  const [salesContractOption] = useOption(getSalesContractOption);
  const [salesOrderOption] = useOption(getSalesOrderOption);

  const column = table.column([
    {
      title: "类型",
      dataIndex: "type",
      valueEnum: recordTypeMap,
    },
    {
      title: "业务",
      dataIndex: "target",
    },
    {
      title: "业务编号",
      dataIndex: "target_code",
      copyable: true,
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
      title: "物资",
      renderText: (_, row) => row.material?.name,
    },
    {
      title: "外径",
      key: "o_diameter",
      renderText: (_, row) => row.material_sku?.o_diameter,
    },
    {
      title: "壁厚",
      key: "wall_thickness",
      renderText: (_, row) => row.material_sku?.wall_thickness,
    },
    {
      title: "内涂层厚度",
      key: "i_coat_thickness",
      renderText: (_, row) => row.material_sku?.i_coat_thickness,
    },
    {
      title: "外涂层厚度",
      key: "o_coat_thickness",
      renderText: (_, row) => row.material_sku?.o_coat_thickness,
    },
    {
      title: "长度",
      key: "length",
      renderText: (_, row) => row.material_sku?.length,
    },
    {
      title: "连接方式",
      key: "connection_type",
      renderText: (_, row) => row.material_sku?.connection_type,
    },
    {
      title: "钢卷类型",
      key: "steel_type",
      renderText: (_, row) => row.material_sku?.steel_type,
    },
    {
      title: "材质",
      key: "texture",
      renderText: (_, row) => row.material_sku?.texture,
    },
    {
      title: "内涂层颜色",
      key: "i_coat_color",
      renderText: (_, row) => row.material_sku?.i_coat_color,
    },
    {
      title: "外涂层颜色",
      key: "o_coat_color",
      renderText: (_, row) => row.material_sku?.o_coat_color,
    },
    {
      title: "数量",
      dataIndex: "num",
    },
    {
      title: "实时库存",
      dataIndex: "now_num",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "批次",
      dataIndex: "batch_no",
    },
    {
      title: "发生时间",
      dataIndex: "created_at",
    },
  ]);

  const columnState = useColumnState("salesDeliverList", column);

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
                name="bill_date"
                transform={(value) => ({
                  start_time: value[0],
                  end_time: value[1],
                })}
                label="发货日期"
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
        //     <Button
        //         key="export"
        //         hidden={!menu.getPermission({key: "export"})}
        //         loading={exporting.whether}
        //         onClick={async () => {
        //             try {
        //                 exporting.setTrue();
        //                 const data = await salesDeliverExport({
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

export default styled(SalesDeliver)``;