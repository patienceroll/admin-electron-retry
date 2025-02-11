import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Card, Col, FloatButton, Input, Pagination, Row, Space } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import { deleteRole, getRoleList, RoleStatus } from "src/apps/admin/api/role";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import DetailSvg from "src/assets/svg/详情.svg";
import EditSvg from "src/assets/svg/eidt.svg";
import ReloadSvg from "src/assets/svg/reload.svg";
import Organization from "src/assets/svg/组织架构.svg";
import DeleteSvg from "src/assets/svg/delete.svg";
import * as Edit from "./components/edit";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import openWindow from "src/util/open-window";
import * as Permission from "./components/permission";

const Role = function (props: StyledWrapComponents) {
  const { className } = props;
  const theme = useTheme();

  const ref = Edit.createRef();
  const permission = Permission.createRef();

  const table = useSearchTable(getRoleList);

  useEffect(() => {
    table.reload();
  }, []);

  return (
    <PageWrapper className={className}>
      <div className="content">
        <Card bordered className="search" style={{ width: 400 }}>
          <Input.Search
            enterButton="查询"
            placeholder="关键字"
            onSearch={(e) => {
              table.extraParams.current.keyword = e || undefined;
              table.onReset();
            }}
          />
        </Card>
        <div className="list">
          <Row gutter={[theme.padding, theme.padding]}>
            {table.dataSource.map((i) => (
              <Col flex="300px" key={i.id}>
                <Card
                  hoverable
                  title={
                    <Space>
                      <span style={{ fontSize: 14 }}>{i.slug}</span>
                    </Space>
                  }
                  extra={
                    <span style={{ color: RoleStatus.get(i.status)?.color }}>
                      {RoleStatus.get(i.status)?.text}
                    </span>
                  }
                  actions={[
                    <Icon
                      key="detail"
                      className="icon"
                      icon={DetailSvg}
                      onClick={() => {
                        openWindow.openCurrentAppWindow(
                          "/system/role/detail",
                          "角色详情"
                        );
                      }}
                    />,
                    <Icon
                      key="edit"
                      className="icon"
                      icon={EditSvg}
                      onClick={() => {
                        ref.current?.edit(i).then(() => {
                          contextedMessage.message?.success("成功编辑");
                          table.reload();
                        });
                      }}
                    />,
                    <Icon
                      key="permission"
                      className="icon"
                      icon={Organization}
                      onClick={() => {
                        permission.current?.edit(i).then(() => {
                          contextedMessage.message?.success("成功保存");
                        });
                      }}
                    />,
                    <Icon
                      key="delete"
                      className="icon"
                      icon={DeleteSvg}
                      fill={theme.colorError}
                      onClick={() => {
                        contextedModal.modal?.confirm({
                          title: "删除",
                          content: `确定删除${i.name}?`,
                          onOk() {
                            return deleteRole({ id: i.id }).then(() => {
                              contextedMessage.message?.success("成功删除");
                              table.reload();
                            });
                          },
                        });
                      }}
                    />,
                  ]}
                >
                  <h3 style={{ fontWeight: 600, textAlign: "center" }}>
                    {i.name}
                  </h3>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="pagenation">
          <Pagination
            current={table.pagination.current}
            pageSize={table.pagination.pageSize}
            total={table.pagination.total}
            onChange={(page, pageSize) => {
              table.onChange(
                { current: page, pageSize },
                {},
                {},
                { action: "paginate", currentDataSource: [] }
              );
            }}
          />
        </div>
      </div>

      <FloatButton.Group shape="square">
        <FloatButton
          description="新增角色"
          icon={<Icon  icon={AddSvg} />}
          onClick={() => {
            ref.current?.create().then(() => {
              contextedMessage.message?.success("成功新增");
              table.reload();
            });
          }}
        />
        <FloatButton
          description="刷新"
          onClick={() => {
            table.reload();
          }}
          icon={
            <Icon
              className={table.loading ? "rotate" : undefined}
              width={18}
              height={18}
              icon={ReloadSvg}
            />
          }
        />
      </FloatButton.Group>
      <Edit.default ref={ref} />
      <Permission.default ref={permission} />
    </PageWrapper>
  );
};

export default styled(Role)`
  .content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - ${(props) => props.theme.padding * 2}px);
  }

  .search {
    flex-shrink: 0;
    margin-bottom: ${(props) => props.theme.margin}px;
  }

  .pagenation {
    margin-top: ${(props) => props.theme.margin}px;
    flex-shrink: 0;
  }

  .list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .rotate {
    animation: spin 2s linear infinite;
  }
`;
