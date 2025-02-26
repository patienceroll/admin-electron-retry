import {
  ProFormText,
  ProFormTreeSelect,
  ProTable,
  QueryFilter,
} from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Button, Card, FloatButton, Space } from "antd";

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
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import contextedMessage from "src/framework/component/contexted-message";
import usePageTableHeight from "src/hooks/use-page-table-height";
import useColumnState from "src/hooks/use-column-state";
import Permission from "src/util/permission";

function Department() {
  const table = useSearchTable(getDepartmentList);
  const theme = useTheme();
  const ref = createRef();

  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );

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

  const columnState = useColumnState("departmentList", column);

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
          <ProFormText name="keyword" label="关键词" />
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
            description="新增部门"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              ref.current?.create().then(() => {
                contextedMessage.message?.success("新增成功");
                table.reload();
              });
            }}
          />
        )}
      </FloatButton.Group>

      <Edit ref={ref} />
    </PageWrapper>
  );
}

export default styled(Department)``;
