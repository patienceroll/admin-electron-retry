import React, { useEffect, useState } from "react";
import { Button, Card, Col, FloatButton, Row, Space, Typography } from "antd";
import styled, { useTheme } from "styled-components";
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  clientExport,
  clientTypeMap,
  deleteClient,
  getClientList,
} from "src/apps/admin/api/client";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import FollowSvg from "src/assets/svg/线索跟进.svg";
import ExportSvg from "src/assets/svg/导出.svg";
import * as Create from "./components/create";
import contextedMessage from "src/framework/component/contexted-message";
import openWindow from "src/util/open-window";
import contextedModal from "src/framework/component/contexted-modal";
import * as Follow from "./components/batch-follow";
import useColumnState from "src/hooks/use-column-state";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";
import usePageTableHeight from "src/hooks/use-page-table-height";
import { StaffStatus } from "src/apps/admin/api/staff";
import images from "src/assets/images";
import AddressFormSearch from "src/framework/component/adress-form-search";
import useStaffTree from "src/b-hooks/use-staff-tree";
import Permission from "src/util/permission";

function Client() {
  const table = useSearchTable(getClientList);
  const theme = useTheme();
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );

  const { options, treeOptions } = useStaffTree();
  const create = Create.createRef();
  const follow = Follow.createRef();

  const [select, setSelect] = useState<Client[]>([]);

  const column = table.column([
    {
      title: "客户",
      dataIndex: "name",
      fixed: "left",
      render: (_, record) => (
        <Typography.Link
          onClick={() => {
            openWindow.openCurrentAppWindow(
              `/client/client/detail?id=${record.id}`,
              "客户详情 - " + record.name_show
            );
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
          {record.is_sign === 1 && <img src={images.contract} alt="合同" />}
        </Space>
      ),
    },
    {
      title: "简称",
      dataIndex: "short_name",
    },
    {
      title: "类型",
      dataIndex: "type",
      valueEnum: clientTypeMap,
    },
    {
      title: "性质",
      dataIndex: "nature",
    },
    {
      title: "等级",
      dataIndex: "grade",
    },
    {
      title: "规模",
      dataIndex: "scale",
    },
    {
      title: "省",
      dataIndex: "province",
    },
    {
      title: "市",
      dataIndex: "city",
    },
    {
      title: "区",
      dataIndex: "county",
    },
    {
      title: "成立日期",
      dataIndex: "establishment_date",
    },
    {
      title: "信息完善度",
      dataIndex: "perfect_ratio",
      valueType: "progress",
    },
    {
      title: "负责人",
      dataIndex: "staff",
      renderText: (_, row) => row.staff?.name,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: StaffStatus,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
    },
    {
      dataIndex: "id",
      title: "操作",
      fixed: "right",
      width: 160,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={function () {
                const window = openWindow.openCurrentAppWindow(
                  `/client/client/edit?id=${row.id}`,
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
                    return deleteClient({ id: row.id }).then(() => {
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

  const columnState = useColumnState("clientlist", column);

  useEffect(() => {
    table.reload();
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
                placeholder="按客户搜索"
              />
            </Col>
            <Col flex="280px">
              <ProFormSelect
                label="客户类型"
                name="type"
                options={Array.from(clientTypeMap.values())}
                fieldProps={{ fieldNames: { label: "text", value: "value" } }}
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
        rowSelection={{
          selectedRowKeys: select.map((i) => i.id),
          preserveSelectedRowKeys: true,
          type: "checkbox",
          fixed: "left",
          onChange(_, rows) {
            setSelect(rows);
          },
        }}
      />

      <FloatButton.Group shape="square">
        {Permission.getPermission("edit") && (
          <FloatButton
            description="新建客户"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              create.current?.create().then((result) => {
                contextedMessage.message?.success("新增成功");
                table.reload();
                const window = openWindow.openCurrentAppWindow(
                  `/client/client/edit?id=${result.id}`,
                  "编辑新创建的客户"
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
        )}
        {select.length !== 0 && (
          <FloatButton
            icon={<Icon icon={FollowSvg} />}
            description="批量跟进"
            onClick={function () {
              follow.current?.follow(select).then(() => {
                contextedMessage.message?.success("成功提交");
              });
            }}
          />
        )}
        {Permission.getPermission("export") && (
          <FloatButton
            icon={<Icon icon={ExportSvg} />}
            description="导出"
            onClick={function () {
              contextedMessage.message?.info("正在导出...");
              clientExport(
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
      <Create.default ref={create} />
      <Follow.default ref={follow} />
    </PageWrapper>
  );
}

export default styled(Client)``;
