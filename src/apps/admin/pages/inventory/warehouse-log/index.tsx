import React, { useEffect } from "react";
import { Card, Col, FloatButton, Row } from "antd";
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
import Icon from "src/framework/component/icon";
import ExportSvg from "src/assets/svg/导出.svg";
import Permission from "src/util/permission";
//主体接口
import {
  getWarehouseLogList,
  recordTypeMap,
  warehouseLogExport,
} from "src/apps/admin/api/warehouse-log";
//关联接口
import { getClientOption } from "src/apps/admin/api/client";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getSalesOrderOption } from "src/apps/admin/api/sales-order";
import AddressFormSearch from "src/framework/component/adress-form-search";
import useStaffTree from "src/b-hooks/use-staff-tree";
import usePageTableHeight from "src/hooks/use-page-table-height";
import contextedMessage from "src/framework/component/contexted-message";

function SalesDeliver() {
  const table = useSearchTable(getWarehouseLogList);
  const theme = useTheme();
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );
  const { options, treeOptions } = useStaffTree();

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

  const columnState = useColumnState("inventory-warehouse-log-list", column);

  useEffect(() => {
    table.reload();
    areaOption.loadOption();
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
      />

      <FloatButton.Group shape="square">
        {Permission.getPermission("export") && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            description="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              warehouseLogExport(
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
    </PageWrapper>
  );
}

export default styled(SalesDeliver)``;
