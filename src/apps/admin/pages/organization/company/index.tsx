import React, { useEffect, useState } from "react";
import PageWrapper from "src/framework/component/page-wrapper";
import styled from "styled-components";

import { getCompanyList } from "src/apps/admin/api/company";
import { Badge, Button, Descriptions, Divider, Space, Typography } from "antd";

function company(props: StyledWrapComponents) {
  const { className } = props;

  const [company, setCompany] = useState<CompanyListItem[]>([]);

  function getCompany() {
    return getCompanyList({ page: 1, pageSize: 100 }).then((res) => {
      setCompany(res.data.list);
    });
  }

  useEffect(() => {
    getCompany();
  }, []);

  return (
    <PageWrapper className={className}>
      <div className="wraper">
        {company.map((item) => (
          <div className="item-wrapper" key={item.id}>
            <Badge.Ribbon text={item?.is_main === 1 ? "总公司" : "分公司"}>
              <div className="item">
                <div className="title">{item.name}</div>
                <Descriptions
                  column={2}
                  items={[
                    {
                      label: "人数",
                      children: `${item.employee_count}人`,
                      span: 2,
                    },
                    {
                      label: "地址",
                      children: item.address || "暂无地址",
                    },
                  ]}
                />
                <Divider orientation="left" plain>
                  法人信息
                </Divider>
                <Descriptions
                  column={2}
                  items={[
                    { label: "法人", children: item.staff?.name },
                    {
                      label: "职务",
                      children: item.staff?.job?.name || "暂无职务",
                    },
                    {
                      label: "电话",
                      children: (
                        <Typography.Text copyable>
                          {item.staff?.phone}
                        </Typography.Text>
                      ),
                    },
                  ]}
                />

                <div className="action">
                  <Space>
                    <Button type="text">详情</Button>
                    <Button type="text">编辑</Button>
                  </Space>
                </div>
              </div>
            </Badge.Ribbon>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export default styled(company)`
  .wraper {
    display: flex;
    box-sizing: border-box;
    padding: ${(props) => props.theme.padding}px;
  }

  .item-wrapper {
    margin-right: ${(props) => props.theme.margin}px;
    margin-top: ${(props) => props.theme.margin}px;
  }

  .item {
    box-sizing: border-box;
    width: 250px;
    height: 280px;
    padding: ${(props) => props.theme.padding}px;
    box-shadow: ${(props) => props.theme.boxShadow};
    border: 1px solid ${(props) => props.theme.colorBorder};
    border-radius: ${(props) => props.theme.borderRadius}px;
    user-select: none;
    position: relative;
  }

  .title {
    font-size: 18px;
    line-height: 24px;
    height: 48px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .action {
    position: absolute;
    bottom: ${(props) => props.theme.padding}px;
    right: ${(props) => props.theme.padding}px;
  }
`;
