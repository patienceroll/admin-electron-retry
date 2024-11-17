import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Badge, Card, Descriptions, Pagination, Space } from "antd";
import {
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import useWather from "src/hooks/use-wather";
import useSearchTable from "src/hooks/use-search-table";
import { deleteJob, getJobList, JobStatus } from "src/apps/admin/api/job";
import Icon from "src/framework/component/icon";

import EditSvg from "src/assets/svg/eidt.svg";
import DeleteSvg from "src/assets/svg/delete.svg";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";

import Edit, { createRef } from "./components/edit";

function Job(props: StyledWrapComponents) {
  const { className } = props;

  const theme = useTheme();

  const ref = createRef();

  const [loading] = useWather();

  const table = useSearchTable(getJobList);

  useEffect(() => {
    table.reload();
  }, []);

  return (
    <PageWrapper>
      <div className={className}>
        <Card className="search" bordered>
          <QueryFilter
            defaultCollapsed
            split
            style={{ padding: 0 }}
            loading={table.loading}
            onReset={table.onReset}
            onFinish={table.onFinish}
          >
            <ProFormText label="职位" name="keyword" placeholder="搜索职位" />
            <ProFormSelect
              label="状态"
              name="statuses"
              placeholder="搜索状态"
              mode="multiple"
              fieldProps={{ fieldNames: { label: "text", value: "value" } }}
              options={Array.from(JobStatus.values())}
            />
          </QueryFilter>
        </Card>

        <div className="content">
          {table.dataSource.map((item) => (
            <Card
              className="item"
              hoverable
              key={item.id}
              styles={{ body: { height: 120, overflowY: "auto" } }}
              title={
                <Space>
                  <span>{item.name}</span>
                  <span
                    style={{
                      color: theme.colorTextSecondary,
                      fontSize: theme.fontSize,
                    }}
                  >
                    {item.department[0].name}
                  </span>
                </Space>
              }
              extra={
                <Badge
                  color={JobStatus.get(item.status)!.color}
                  text={JobStatus.get(item.status)!.text}
                />
              }
              actions={[
                <Icon
                  icon={EditSvg}
                  onClick={() => {
                    ref.current?.edit(item).then(table.reload);
                  }}
                />,
                <Icon
                  icon={DeleteSvg}
                  fill={theme.colorError}
                  onClick={() => {
                    contextedModal.modal?.confirm({
                      title: "删除",
                      content: `确定删除${item.name}?`,
                      onOk() {
                        return deleteJob({ id: item.id }).then(() => {
                          contextedMessage.message?.success("成功删除");
                          table.reload();
                        });
                      },
                    });
                  }}
                />,
              ]}
            >
              <Descriptions column={1}>
                <Descriptions.Item style={{ whiteSpace: "pre-wrap" }}>
                  {item.remark}
                </Descriptions.Item>
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
        </div>
      </div>
      <Edit ref={ref} />
    </PageWrapper>
  );
}

export default styled(Job)`
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
  }

  .item {
    width: 300px;
    margin-right: ${(props) => props.theme.margin}px;
    margin-bottom: ${(props) => props.theme.margin}px;
  }

  .page {
    display: flex;
    justify-content: right;
  }
`;
