import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Affix, Button, Card } from "antd";
import {
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
  QueryFilter,
} from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import { getStaffList, StaffStatus } from "src/apps/admin/api/staff";
import { getDepartmentTree } from "src/apps/admin/api/department";

function Staff() {
  const table = useSearchTable(getStaffList);
  const theme = useTheme();

  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);

  function getTree() {
    getDepartmentTree().then((res) => {
      setDeparmentTree(res.data);
    });
  }

  const column = table.column([
    {
      title: "关键词",
      dataIndex: "name",
      fixed: "left",
    },
    {
      title: "部门",
      render: (_, row) => row.department?.name || "-",

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
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: StaffStatus,
    },
    {
      title: "操作",
      fixed: "right",
      width: 150,
    },
  ]);

  useEffect(() => {
    table.getData();
    getTree();
  }, []);

  return (
    <PageWrapper>
      <Affix offsetTop={theme.padding}>
        <Card bordered>
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
        toolBarRender={() => [
          <Button
            type="primary"
            // hidden={!menu.getPermission()}
            key={1}
            // onClick={() => {
            //   ref.current?.create().then(table.reload);
            // }}
          >
            新增部门
          </Button>,
        ]}
        columns={column}
        scroll={{ x: table.measureColumnWidth(column) }}
      />
    </PageWrapper>
  );
}

export default styled(Staff)``;
