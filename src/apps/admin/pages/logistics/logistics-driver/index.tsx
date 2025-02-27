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
import usePageTableHeight from "src/hooks/use-page-table-height";
import {
  deleteDriver,
  DriverStatus,
  getDriverList,
} from "src/apps/admin/api/logistics-driver";
import useColumnState from "src/hooks/use-column-state";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";
import { watherMap } from "src/apps/admin/api/general";
import useOption from "src/hooks/use-option";
import { getLogisticsCompanyOptions } from "src/apps/admin/api/logistics-company";
import Permission from "src/util/permission";
import contextedMessage from "src/framework/component/contexted-message";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import * as Modify from "./components/modify";
import contextedModal from "src/framework/component/contexted-modal";
function Driver() {
  const table = useSearchTable(getDriverList);
  const theme = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin + (isCompact ? 4 : 14)
  );

  const modify = Modify.createRef();
  const [logisticsCompany] = useOption(getLogisticsCompanyOptions);

  useEffect(() => {
    logisticsCompany.loadOption();
    table.reload();
  }, []);

  const column = table.column([
    {
      title: "物流公司",
      dataIndex: "logistics_company",

      renderText(_, row) {
        return row.logistics_company?.name;
      },
      ellipsis: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "是否为本公司",
      dataIndex: "is_own",
      valueEnum: watherMap,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      copyable: true,
    },
    {
      title: "年龄",
      dataIndex: "age",
    },
    {
      title: "驾龄",
      dataIndex: "driver_age",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "statuses",
      valueEnum: DriverStatus,
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
                    return deleteDriver({ id: row.id }).then(() => {
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
  const columnState = useColumnState("logistics-driver-list", column);

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
                label="姓名"
                name="keyword"
                placeholder="按姓名搜索"
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
            description="新建司机"
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

export default styled(Driver)``;
