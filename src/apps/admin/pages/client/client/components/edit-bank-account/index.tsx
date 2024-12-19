import ProTable from "@ant-design/pro-table/es";
import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";

import useSearchTable from "src/hooks/use-search-table";
import { Button, Space } from "antd/es";
import {
  deleteBankAccount,
  getBankAccountList,
} from "src/apps/admin/api/bank-account";
import * as Edit from "./edit";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
const EditBankAccount = function (
  props: StyledWrapComponents<{ id: Client["id"] }>
) {
  const { id } = props;
  const theme = useTheme();
  const edit = Edit.createRef();
  const bankAccount = useSearchTable(getBankAccountList);

  const bankAccountColumn = bankAccount.column([
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
              onClick={function () {
                edit.current?.edit(entity).then(() => {
                  contextedMessage.message?.success("成功编辑");
                  bankAccount.reload();
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
                  content: `确定删除${entity.name}?`,
                  onOk() {
                    return deleteBankAccount({ id: entity.id }).then(() => {
                      contextedMessage.message?.success("成功删除");
                      bankAccount.reload();
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

  useEffect(() => {
    bankAccount.extraParams.current.table_id = id;
    bankAccount.extraParams.current.type = 2;
    bankAccount.reload();
  }, []);
  return (
    <>
      <ProTable
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        options={bankAccount.options}
        loading={bankAccount.loading}
        dataSource={bankAccount.dataSource}
        pagination={bankAccount.pagination}
        onChange={bankAccount.onChange}
        columns={bankAccountColumn}
        scroll={{ x: bankAccount.measureColumnWidth(bankAccountColumn) }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={function () {
              edit.current?.create().then(() => {
                bankAccount.reload();
              });
            }}
          >
            新增账户
          </Button>,
        ]}
      />
      <Edit.default ref={edit} id={id} />
    </>
  );
};

export default styled(EditBankAccount)``;
