import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import {
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Card, Col, FloatButton, Row, Space } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  deleteLogisticsContract,
  getLogisticsContractList,
  LogisticsContractStatus,
} from "src/apps/admin/api/logistics-contract";
import usePageTableHeight from "src/hooks/use-page-table-height";
import Permission from "src/util/permission";
import contextedMessage from "src/framework/component/contexted-message";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import * as Modify from "./components/modify";
import contextedModal from "src/framework/component/contexted-modal";
import useOption from "src/hooks/use-option";
import { getLogisticsCompanyOptions } from "src/apps/admin/api/logistics-company";
import { getDriverOptions } from "src/apps/admin/api/logistics-driver";
import useColumnState from "src/hooks/use-column-state";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";

function LogisticsContract() {
  const table = useSearchTable(getLogisticsContractList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 4 : 14)
  );

  const modify = Modify.createRef();
  const [logisticsCompany] = useOption(getLogisticsCompanyOptions);
  const [driver] = useOption(getDriverOptions);

  useEffect(() => {
    logisticsCompany.loadOption();
    table.reload();
    driver.loadOption();
  }, []);

  const column = table.column([
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "编号",
      dataIndex: "code",
    },
    {
      title: "物流公司",
      dataIndex: "logistics_company",

      renderText(_, row) {
        return row.logistics_company?.name;
      },
      ellipsis: true,
    },
    {
      title: "司机",
      dataIndex: "driver",
      renderText(_, row) {
        return row.driver?.name;
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "statuses",
      valueEnum: LogisticsContractStatus,
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
                modify.current?.edit(row).then(() => {
                  table.reload();
                  contextedMessage.message?.success("成功编辑");
                });
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
                    return deleteLogisticsContract({ id: row.id }).then(() => {
                      contextedMessage.message?.success("成功删除");
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

  const columnState = useColumnState("logistics-contract-list", column);

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
                placeholder="按关键词搜索"
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect<LogisticsCompany>
                label="物流公司"
                name="logistics_company_ids"
                placeholder="按物流公司搜索"
                options={logisticsCompany.list}
                showSearch
                mode="multiple"
                fieldProps={{
                  loading: logisticsCompany.loading,
                  optionFilterProp: "name",
                  fieldNames: { label: "name", value: "id" },
                }}
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect<Driver>
                label="司机"
                name="driver_ids"
                placeholder="按司机搜索"
                options={driver.list}
                showSearch
                mode="multiple"
                fieldProps={{
                  loading: driver.loading,
                  optionFilterProp: "name",
                  fieldNames: { label: "name", value: "id" },
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
        {Permission.getPermission("edit") && (
          <FloatButton
            description="新建合同"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              modify.current?.create().then(() => {
                contextedMessage.message?.success("成功新增");
                table.reload();
              });
            }}
          />
        )}
      </FloatButton.Group>

      <Modify.default ref={modify} />
    </PageWrapper>
  );
}

export default styled(LogisticsContract)``;
