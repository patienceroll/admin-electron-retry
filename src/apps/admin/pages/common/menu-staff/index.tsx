import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Space, Tag } from "antd";
import { ProTable } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useWather from "src/hooks/use-wather";
import { getMenuTree } from "src/apps/admin/api/menu";
import {
  tableColumn,
  tableMeasureColumnWidth,
} from "src/hooks/use-search-table";
import * as Department from "./components/department";
import contextedMessage from "src/framework/component/contexted-message";
import * as Staff from "./components/staff";

type Data = Omit<Menu, "child"> & { children?: Data[] };

const MenuStaff = function () {
  const [loading] = useWather();
  const departmentRef = Department.createRef();
  const staffRef = Staff.createRef();

  const [dataSource, setDataSource] = useState<Data[]>([]);

  function getData() {
    loading.setTrue();
    getMenuTree({ type: 2 })
      .then((res) => {
        function deep(item: Menu[]): Data[] {
          return item.map((i) => ({
            ...i,
            children:
              i.child && i.child.length !== 0 ? deep(i.child) : undefined,
          }));
        }
        setDataSource(deep(res.data));
      })
      .finally(loading.setFalse);
  }

  useEffect(() => {
    getData();
  }, []);

  const column = tableColumn<Data>([
    {
      title: "菜单",
      dataIndex: "name",
      width: 250,
    },
    {
      title: "组织",

      render: (_, entity) => {
        return entity.menu_department?.map((department) => (
          <Tag key={department.id}>{department.department?.name}</Tag>
        ));
      },
    },
    {
      title: "人员",

      render: (_, entity) => {
        return entity.menu_staff?.map((staff) => (
          <Tag key={staff.id}>{staff.staff?.name}</Tag>
        ));
      },
    },
    {
      title: "操作",
      dataIndex: "id",
      width: 250,
      render(_, row) {
        if (row.level === 1) return null;
        return (
          <Space>
            <Button
              type="text"
              onClick={function () {
                departmentRef.current?.edit(row).then(() => {
                  contextedMessage.message?.success("成功设置");
                  getData();
                });
              }}
            >
              设置组织
            </Button>
            <Button
              type="text"
              onClick={function () {
                staffRef.current?.edit(row).then(() => {
                  contextedMessage.message?.success("成功设置");
                  getData();
                });
              }}
            >
              设置人员
            </Button>
          </Space>
        );
      },
    },
  ]);

  return (
    <PageWrapper>
      <ProTable
        rowKey="id"
        search={false}
        loading={loading.whether}
        options={false}
        dataSource={dataSource}
        pagination={false}
        columns={column}
        scroll={{ x: tableMeasureColumnWidth(column) }}
      />
      <Department.default ref={departmentRef} />
      <Staff.default ref={staffRef} />
    </PageWrapper>
  );
};

export default styled(MenuStaff)``;
