import { ProTable } from "@ant-design/pro-components";
import React, { useEffect } from "react";
import { useTheme } from "styled-components";
import { Button, Space } from "antd";

import useSearchTable from "src/hooks/use-search-table";
import { deleteSupplierContact } from "src/apps/admin/api/supplier-contact";
import useColumnState from "src/hooks/use-column-state";
import * as Modify from "./modify";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";
import {
  deleteBankAccount,
  getBankAccountList,
} from "src/apps/admin/api/bank-account";

export default function (props: Pick<Supplier, "id">) {
  const { id } = props;
  const theme = useTheme();

  const modify = Modify.createRef();
  const table = useSearchTable(getBankAccountList);

  const column = table.column([
    {
      title: "公司",
      dataIndex: "company_name",
    },
    {
      title: "地址",
      dataIndex: "company_address",
    },
    {
      title: "联系人",
      dataIndex: "linkman",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "银行",
      dataIndex: "bank_name",
    },
    {
      title: "开户行",
      dataIndex: "bank_address",
    },
    {
      title: "税号",
      dataIndex: "tax_code",
    },
    {
      title: "账号",
      dataIndex: "account",
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
                  content: `确定删除${entity.account}?`,
                  onOk() {
                    return deleteBankAccount({ id: entity.id }).then(() => {
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

  const columnState = useColumnState("edit_suppler_bank_account", column);

  useEffect(() => {
    table.extraParams.current.table_id = id;
    table.extraParams.current.type = 3
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
          新建账户
        </Button>,
        <Modify.default id={id} key="modify" ref={modify} />,
      ]}
    />
  );
}
