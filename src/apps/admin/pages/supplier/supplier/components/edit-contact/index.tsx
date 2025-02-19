import { ProTable } from "@ant-design/pro-components";
import React, { useEffect } from "react";
import { useTheme } from "styled-components";
import { Button, Space } from "antd";

import useSearchTable from "src/hooks/use-search-table";
import {
  deleteSupplierContact,
  getSupplierContactList,
} from "src/apps/admin/api/supplier-contact";
import useColumnState from "src/hooks/use-column-state";
import * as Modify from "./modify";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";

export default function (props: Pick<Supplier, "id">) {
  const { id } = props;
  const theme = useTheme();

  const modify = Modify.createRef();
  const table = useSearchTable(getSupplierContactList);

  const column = table.column([
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "职位",
      dataIndex: "job_title",
    },
    {
      title: "手机",
      dataIndex: "phone",
    },
    {
      title: "微信",
      dataIndex: "wechat",
    },
    {
      title: "身份证",
      dataIndex: "ID_card",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "操作",
      dataIndex: "id",
      fixed: "right",
      width: 150,
      render(dom, entity) {
        return (
          <Space>
            <Button
              type="text"
              onClick={() => {
                modify.current?.edit(entity).then(() => {
                  table.reload();
                });
              }}
            >
              编辑
            </Button>
            <Button
              type="text"
              danger
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "删除",
                  content: `确定删除${entity.name}?`,
                  onOk() {
                    return deleteSupplierContact({ id: entity.id }).then(() => {
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

  const columnState = useColumnState("edit_suppler_contact", column);

  useEffect(() => {
    table.extraParams.current.supplier_id = id;
    table.reload();
  }, [id]);

  return (
    <ProTable
      style={{ marginTop: theme.margin }}
      rowKey="id"
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
      scroll={{ x: table.measureColumnWidth(columnState.widthColumn), y: 500 }}
      toolBarRender={() => [
        <Button
          type="primary"
          key="add"
          onClick={() => {
            modify.current?.create().then(() => {
              table.reload();
            });
          }}
        >
          新增联系人
        </Button>,
        <Modify.default id={id} key="modify" ref={modify} />,
      ]}
    />
  );
}
