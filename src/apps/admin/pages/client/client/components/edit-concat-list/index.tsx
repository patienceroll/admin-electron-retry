import ProTable from "@ant-design/pro-table/es";
import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";

import { Button, Space } from "antd/es";

import useSearchTable from "src/hooks/use-search-table";
import {
  deleteClientContact,
  getClientContactList,
} from "src/apps/admin/api/client-concat";
import * as Edit from "./edit";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";

const EditConcatList = function (
  props: StyledWrapComponents<{ id: Client["id"] }>
) {
  const { id } = props;
  const theme = useTheme();
  const edit = Edit.createRef();
  const clientContract = useSearchTable(getClientContactList);

  const clientContractColumn = clientContract.column([
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
                  clientContract.reload();
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
                    return deleteClientContact({ id: entity.id }).then(() => {
                      contextedMessage.message?.success("成功删除");
                      clientContract.reload();
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
    clientContract.extraParams.current.client_id = id;
    clientContract.reload();
  }, []);
  return (
    <>
      <ProTable
        search={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        options={clientContract.options}
        loading={clientContract.loading}
        dataSource={clientContract.dataSource}
        pagination={clientContract.pagination}
        onChange={clientContract.onChange}
        columns={clientContractColumn}
        scroll={{ x: clientContract.measureColumnWidth(clientContractColumn) }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={function () {
              edit.current?.create().then(() => {
                clientContract.reload();
              });
            }}
          >
            新增联系人
          </Button>,
        ]}
      />
      <Edit.default ref={edit} id={id} />
    </>
  );
};

export default styled(EditConcatList)``;
