import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Button, Card, FloatButton, Space } from "antd";
import {
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
  QueryFilter,
} from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  deleteStaff,
  getStaffList,
  StaffStatus,
} from "src/apps/admin/api/staff";
import { getDepartmentTree } from "src/apps/admin/api/department";
import openWindow from "src/util/open-window";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import EditPermission, { createRef } from "./components/edit-permission";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import usePageTableHeight from "src/hooks/use-page-table-height";
import useColumnState from "src/hooks/use-column-state";
import Permission from "src/util/permission";

function Staff() {
  const table = useSearchTable(getStaffList);
  const theme = useTheme();
  const permissionRef = createRef();

  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );

  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);

  function getTree() {
    getDepartmentTree().then((res) => {
      setDeparmentTree(res.data);
    });
  }

  const column = table.column([
    {
      title: "部门",
      render: (_, row) => row.department?.name,
      fixed: "left",
    },
    {
      title: "姓名",
      dataIndex: "name",
      fixed: "left",
    },
    {
      title: "工号",
      dataIndex: "code",
    },
    {
      title: "职位",
      dataIndex: "job",
      render: (_, row) => row.job?.name,
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "性别",
      dataIndex: "gender",
      valueEnum: {
        0: "未知",
        1: "男",
        2: "女",
      },
    },
    {
      title: "年龄",
      dataIndex: "age",
    },
    {
      title: "工龄",
      dataIndex: "work_age",
    },
    {
      title: "学历",
      dataIndex: "educational",
    },
    {
      title: "专业",
      dataIndex: "profession",
    },
    {
      title: "职称",
      dataIndex: "position_title",
    },
    {
      title: "头像",
      valueType: "image",
      renderText: (_, row) => row.avatar_path,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: StaffStatus,
    },
    {
      title: "操作",
      fixed: "right",
      width: 200,
      render: (_, row) => (
        <Space>
          <Button
            type="text"
            onClick={function () {
              const window = openWindow.openCurrentAppWindow(
                `/organization/staff/edit?id=${row.id}`,
                "编辑员工"
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
            onClick={function () {
              permissionRef.current?.setPermission(row).then(() => {
                contextedMessage.message?.success("成功设置");
                table.reload();
              });
            }}
          >
            权限
          </Button>
          <Button
            type="text"
            danger
            onClick={() => {
              contextedModal.modal?.confirm({
                title: "删除",
                content: `确定删除${row.name}?`,
                onOk() {
                  return deleteStaff({ id: row.id }).then(() => {
                    contextedMessage.message?.success("删除成功");
                    table.reload();
                  });
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]);

  const columnState = useColumnState("staffList", column);

  useEffect(() => {
    table.getData();
    getTree();
  }, []);

  return (
    <PageWrapper>
      <Card
        bordered
        ref={(div) => {
          if (div) addAElement(div);
        }}
      >
        <QueryFilter
          defaultCollapsed
          split
          style={{ padding: 0, rowGap: 0 }}
          loading={table.loading}
          onReset={table.onReset}
          onFinish={table.onFinish}
        >
          <ProFormTreeSelect
            label="部门"
            name="department_id"
            placeholder="搜索该部门下的员工"
            fieldProps={{
              treeData: deparmentTree,
              showSearch: true,
              treeNodeFilterProp: "name",
              fieldNames: {
                children: "child",
                label: "name",
                value: "id",
              },
            }}
          />
          <ProFormText
            name="keyword"
            label="关键词"
            placeholder="搜索姓名/工号"
          />
          <ProFormSelect
            name="status"
            label="状态"
            options={Array.from(StaffStatus.values()).map((item) => ({
              label: item.text,
              value: item.value,
            }))}
          />
          <ProFormSelect
            name="statuses"
            label="性别"
            mode="multiple"
            options={[
              { label: "未知", value: 0 },
              { label: "男", value: 1 },
              { label: "女", value: 2 },
            ]}
          />
        </QueryFilter>
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
        columnsState={{
          value: columnState.data?.data,
          onChange: columnState.onChange,
        }}
        components={{
          header: {
            cell: columnState.tableHeaderCellRender,
          },
        }}
        scroll={{
          x: table.measureColumnWidth(columnState.widthColumn),
          y: height,
        }}
      />
      <FloatButton.Group shape="square">
        {Permission.getPermission("edit") && (
          <FloatButton
            description="新建员工"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              const window = openWindow.openCurrentAppWindow(
                "/organization/staff/create",
                "新建员工"
              );
              function listener(event: MessageEvent<"success">) {
                if (event.data === "success") {
                  table.reload();
                  contextedMessage.message?.success("新建成功");
                }
              }
              if (window) {
                window.addEventListener("message", listener);
              }
            }}
          />
        )}
      </FloatButton.Group>
      <EditPermission ref={permissionRef} />
    </PageWrapper>
  );
}

export default styled(Staff)``;
