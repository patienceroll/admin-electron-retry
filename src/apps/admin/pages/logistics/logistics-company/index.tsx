import styled, { useTheme } from "styled-components";
import React, { useEffect } from "react";
import { Badge, Button, Card, Col, Descriptions, Pagination, Row } from "antd";
import { ProFormText } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useSearchTable from "src/hooks/use-search-table";
import {
  deleteLogisticsCompany,
  getLogisticsCompanyList,
  LogisticsCompanyStatus,
} from "src/apps/admin/api/logistics-company";
import Search from "src/framework/component/search";
import SearchAction from "src/framework/component/search/search-action";
import Icon from "src/framework/component/icon";
import * as Modify from "./components/modify";
import AddSvg from "src/assets/svg/add.svg";
import EditSvg from "src/assets/svg/eidt.svg";
import DeleteSvg from "src/assets/svg/delete.svg";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
function LogisticsCompany(props: StyledWrapComponents) {
  const { className } = props;
  const table = useSearchTable(getLogisticsCompanyList);
  const theme = useTheme();

  const modify = Modify.createRef();

  useEffect(() => {
    table.reload();
  }, []);
  return (
    <PageWrapper className={className}>
      <Card bordered>
        <Search>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="300px">
              <ProFormText
                label="公司名称"
                name="keyword"
                placeholder="搜索公司名称"
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

      <div className="content">
        {table.dataSource.map((item) => (
          <Card
            className="item"
            hoverable
            key={item.id}
            styles={{ body: { height: 120, overflowY: "auto" } }}
            title={<span>{item.name}</span>}
            extra={
              <Badge
                color={LogisticsCompanyStatus.get(item.status)!.color}
                text={LogisticsCompanyStatus.get(item.status)!.text}
              />
            }
            actions={[
              <div
                onClick={() => {
                  modify.current?.edit(item).then(() => {
                    table.reload();
                    contextedMessage.message?.success("成功编辑");
                  });
                }}
              >
                <Icon icon={EditSvg} />
              </div>,
              <div
                onClick={() => {
                  contextedModal.modal?.confirm({
                    title: "删除",
                    content: `确定删除${item.name}?`,
                    onOk() {
                      return deleteLogisticsCompany({ id: item.id }).then(
                        () => {
                          contextedMessage.message?.success("成功删除");
                          table.reload();
                        }
                      );
                    },
                  });
                }}
              >
                <Icon icon={DeleteSvg} fill={theme.colorError} />
              </div>,
            ]}
          >
            <Descriptions size="small">
              <Descriptions.Item>{item.remark}</Descriptions.Item>
            </Descriptions>
          </Card>
        ))}
      </div>

      <div className="page">
        <Pagination
          {...table.pagination}
          onChange={(page, pageSize) => {
            table.onChange(
              { current: page, pageSize },
              {},
              {},
              { action: "paginate", currentDataSource: [] }
            );
          }}
        />

        <Button
          type="primary"
          icon={
            <Icon
              width={18}
              height={18}
              icon={AddSvg}
              fill={theme.colorWhite}
            />
          }
          onClick={() => {
            modify.current?.create().then(() => {
              table.reload();
              contextedMessage.message?.success("成功创建");
            });
          }}
        >
          新建公司
        </Button>
      </div>
      <Modify.default ref={modify} />
    </PageWrapper>
  );
}

export default styled(LogisticsCompany)`
  display: flex;
  height: calc(100vh - ${(props) => props.theme.padding * 2}px);
  flex-direction: column;

  .search {
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    margin-block: ${(props) => props.theme.margin}px;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .item {
    width: 300px;
    margin-right: ${(props) => props.theme.margin}px;
    margin-bottom: ${(props) => props.theme.margin}px;
  }

  .page {
    margin-top: ${(props) => props.theme.margin}px;
    display: flex;
    justify-content: space-between;
  }
`;
