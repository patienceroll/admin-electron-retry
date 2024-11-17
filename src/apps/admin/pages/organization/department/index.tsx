import {
  ProFormText,
  ProFormTreeSelect,
  ProTable,
  QueryFilter,
} from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Affix, Button, Card, Space } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  deleteDepartment,
  DepartmentStatus,
  getDepartmentList,
  getDepartmentTree,
} from "src/apps/admin/api/department";
import Edit, { createRef } from "./components/edit";
import contextedModal from "src/framework/component/contexted-modal";

function Department() {
  const table = useSearchTable(getDepartmentList);
  const theme = useTheme();
  const ref = createRef();

  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);

  function getTree() {
    getDepartmentTree().then((res) => {
      setDeparmentTree(res.data);
    });
  }

  const column = table.column([
    {
      title: "部门",
      dataIndex: "name",
      fixed: "left",
    },
    {
      title: "负责人",
      dataIndex: "staff",
      renderText: (_, row) => row.staff?.name,
    },
    {
      title: "上级部门",
      dataIndex: "p_department",
      renderText: (_, row) => row.p_department?.name,
    },
    {
      title: "职责",
      dataIndex: "remark",
    },
    {
      title: "职位",
      dataIndex: "job_count",
    },
    {
      title: "职员",
      dataIndex: "employee_count",
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: DepartmentStatus,
    },
    {
      title: "编辑",
      fixed: "right",
      width: 150,
      render: (_, row) => (
        <Space>
          <Button
            type="text"
            onClick={() => {
              ref.current?.edit(row).finally(table.reload);
            }}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            onClick={() => {
              contextedModal.modal?.confirm({
                title: "确定删除",
                content: `确定要删除部门：${row.name}`,
                onOk() {
                  return deleteDepartment({ id: row.id }).then(table.reload);
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
              fieldProps={{
                treeData: deparmentTree,
                fieldNames: {
                  children: "child",
                  label: "name",
                  value: "id",
                },
              }}
            />
            <ProFormText name="keyword" label="关键词" />
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
            onClick={() => {
              ref.current?.create().then(table.reload);
            }}
          >
            新增部门
          </Button>,
        ]}
        columns={column}
        scroll={{ x: table.measureColumnWidth(column) }}
      />
      <Edit ref={ref} />
    </PageWrapper>
  );
}

export default styled(Department)``;
