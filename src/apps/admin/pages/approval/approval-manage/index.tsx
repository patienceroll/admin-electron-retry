import styled, { useTheme } from "styled-components";
import React, { useEffect } from "react";
import { Button, Card, Col, FloatButton, Row, Space } from "antd";
import { ProFormText, ProTable } from "@ant-design/pro-components";

import Search from "src/framework/component/search";
import PageWrapper from "src/framework/component/page-wrapper";
import SearchAction from "src/framework/component/search/search-action";

import useSearchTable from "src/hooks/use-search-table";
import useColumnState from "src/hooks/use-column-state";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import { deleteApproval, getApprovals } from "src/apps/admin/api/approval";
import usePageTableHeight from "src/hooks/use-page-table-height";
import Permission from "src/util/permission";
import * as Modify from "./components/modify";

function ApprovalManage(props: StyledWrapComponents) {
  const { className } = props;
  const table = useSearchTable(getApprovals);
  const theme = useTheme();
  const { addAElement, height } = usePageTableHeight(
    theme.padding * 2 + theme.margin
  );
  const modify = Modify.createRef();

  const column = table.column([
    {
      title: "业务",
      dataIndex: "table_show",
      fixed: "left",
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "编号",
      dataIndex: "code",
    },
    {
      title: "发起人职位",
      dataIndex: "job",
      render: (_, row) => row.job?.name,
      ellipsis: true,
    },
    {
      title: "流程",
      dataIndex: "note",
      renderText: (_, row) => (
        <div className="note">
          {row.note?.map((item, index) => (
            <div key={item.staff_id} className="note-item">
              <div className="sort">{index + 1}</div>

              <span>{item.staff.name}</span>
              <div>{item.staff.job.name}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      dataIndex: "action",
      title: "操作",
      fixed: "right",
      width: 150,
      render(_, row) {
        return (
          <Space>
            <Button
              type="text"
              onClick={function () {
                modify.current?.edit(row).then(() => {
                  table.reload();
                  contextedMessage.message?.success("成功编辑");
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
                  content: `确定删除${row.name}审批流程?`,
                  onOk() {
                    return deleteApproval({ id: row.id }).then(() => {
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
        );
      },
    },
  ]);

  const columnState = useColumnState("approvalManageList", column);
  useEffect(() => {
    table.reload();
  }, []);

  return (
    <PageWrapper className={className}>
      <Card
        bordered
        ref={(div) => {
          if (div) addAElement(div);
        }}
      >
        <Search>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="280px">
              <ProFormText
                label="关键词"
                name="keyword"
                placeholder="名称/编号"
              />
            </Col>
            <Col flex="80px">
              <SearchAction
                loading={table.loading}
                onReset={table.onReset}
                onFinish={table.onFinish}
              />
            </Col>
          </Row>
        </Search>
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
        scroll={{
          x: table.measureColumnWidth(columnState.widthColumn),
          y: height,
        }}
        columnsState={{
          value: columnState.data?.data,
          onChange: columnState.onChange,
        }}
        components={{
          header: {
            cell: columnState.tableHeaderCellRender,
          },
        }}
      />

      <FloatButton.Group shape="square">
        {Permission.getPermission("edit") && (
          <FloatButton
            description="新建流程"
            icon={<Icon icon={AddSvg} />}
            onClick={() => {
              modify.current?.create().then(() => {
                contextedMessage.message?.success("成功新增");
                table.reload();
              });
            }}
          />
        )}

        <Modify.default ref={modify} />
      </FloatButton.Group>
    </PageWrapper>
  );
}

export default styled(ApprovalManage)`
  .note {
    width: 100%;
    overflow-x: auto;
  }

  .note-item {
    display: inline-flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding-inline: ${props => props.theme.padding}px;

  }

  .sort {
    width: 25px;
    height: 25px;
    background-color: ${(props) => props.theme.colorPrimary};
    border-radius: 50%;
    text-align: center;
    line-height: 25px;
    color: ${(props) => props.theme.colorWhite};
    margin: 0 auto;
  }
`;
