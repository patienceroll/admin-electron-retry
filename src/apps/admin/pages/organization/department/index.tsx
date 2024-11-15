import { ProFormText, ProTable, QueryFilter } from "@ant-design/pro-components";
import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Affix, Button, Card, Space } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  DepartmentStatus,
  getDepartmentList,
} from "src/apps/admin/api/department";

function Department() {
  const table = useSearchTable(getDepartmentList);
  const theme = useTheme();

  useEffect(() => {
    table.getData();
  }, []);

  return (
    <PageWrapper>
      <Affix offsetTop={theme.padding}>
        <Card bordered>
          <QueryFilter
            defaultCollapsed
            split
            style={{ padding: 0 }}
            loading={table.loading}
            onReset={table.onReset}
            onFinish={table.onFinish}
          >
            <ProFormText name="keyword" label="关键词" />
          </QueryFilter>
        </Card>
      </Affix>
      <br />
      <ProTable
        rowKey="id"
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
            onClick={() => {}}
          >
            新增部门
          </Button>,
        ]}
        columns={table.column([
          {
            title: "部门",
            dataIndex: "name",
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
            render: () => (
              <Space>
                <Button type="text">编辑</Button>
                <Button type="text" danger>
                  删除
                </Button>
              </Space>
            ),
          },
        ])}
      />
    </PageWrapper>
  );
}

export default styled(Department)``;
