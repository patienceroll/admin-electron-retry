import React, { useEffect, useState } from "react";
import { Anchor, Col, Row } from "antd/es";
import { useLocation } from "react-router/dist";
import styled, { useTheme } from "styled-components";
import { ProTable } from "@ant-design/pro-components/es";

import PageWrapper from "src/framework/component/page-wrapper";
import { getClient } from "src/apps/admin/api/client";
import { projectTypeMap } from "src/apps/admin/api/project";
import InfoItem from "src/framework/component/info-item";

import Title from "src/framework/component/title";
import useOption from "src/hooks/use-option";
import { getClientContactOptions } from "src/apps/admin/api/client-concat";
import { tableColumn } from "src/hooks/use-search-table";
import { getBankAccountOptions } from "src/apps/admin/api/bank-account";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")!;

  const theme = useTheme();
  const [concat] = useOption(getClientContactOptions);
  const [bankAccount] = useOption(getBankAccountOptions);

  const [detail, setDetail] = useState<ClientListItem>();

  function getDetail() {
    getClient({ id: Number(id) }).then((res) => {
      setDetail(res.data);
    });
  }

  useEffect(() => {
    getDetail();
    concat.params.client_id = Number(id);
    concat.loadOption();
    bankAccount.params.table_id = Number(id);
    bankAccount.params.type = 2;
    bankAccount.params.table = "client";
    bankAccount.loadOption();
  }, []);

  return (
    <PageWrapper className={className}>
      <Title id="基本信息">基本信息</Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="300px">
            <InfoItem label="客户">{detail.name}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="简称">{detail.short_name}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="类型">
              {projectTypeMap.get(detail.type)?.text}
            </InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="详细地址">{detail.address}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="是否签约">{detail.is_sign ? "是" : "否"}</InfoItem>
          </Col>
        </Row>
      )}
      <Title style={{ marginTop: theme.margin }} id="联系人">
        联系人
      </Title>
      <ProTable
        className="custom-pro-table"
        search={false}
        pagination={false}
        options={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        scroll={{ y: 400 }}
        loading={concat.loading}
        dataSource={concat.list}
        columns={tableColumn<ClientContaListItem>([
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
        ])}
      />
      <Title style={{ marginTop: theme.margin }} id="账号信息">
        账号信息
      </Title>
      <ProTable
        search={false}
        pagination={false}
        options={false}
        rowKey="id"
        style={{ marginTop: theme.margin }}
        loading={bankAccount.loading}
        dataSource={bankAccount.list}
        columns={tableColumn<BankAccount>([
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
        ])}
      />
      <Title style={{ marginTop: theme.margin }} id="系统信息">
        系统信息
      </Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="300px">
            <InfoItem label="创建人">{detail.created_user?.name}</InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="创建时间">
              {detail.created_user?.created_at}
            </InfoItem>
          </Col>
          <Col flex="300px">
            <InfoItem label="更新时间">
              {detail.created_user?.updated_at}
            </InfoItem>
          </Col>
        </Row>
      )}

      <Anchor
        className="anchor"
        onClick={(e, link) => {
          e.preventDefault();
          document
            .getElementById(`${link.title}`)
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        items={[
          {
            key: "基本信息",
            href: "基本信息",
            title: "基本信息",
          },
          {
            key: "联系人",
            href: "联系人",
            title: "联系人",
          },
          {
            key: "账号信息",
            href: "账号信息",
            title: "账号信息",
          },
          {
            key: "系统信息",
            href: "系统信息",
            title: "系统信息",
          },
        ]}
      />
    </PageWrapper>
  );
}

export default styled(Detail)`
  padding-right: 200px;

  .anchor {
    position: fixed;
    top: 50%;
    right: 100px;
    transform: translateY(-50%);
  }
`;
