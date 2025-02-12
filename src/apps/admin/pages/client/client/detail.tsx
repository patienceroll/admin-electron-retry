import React, { useCallback, useEffect, useState } from "react";
import { Anchor, Col, Row } from "antd";
import { useLocation } from "react-router";
import styled, { useTheme } from "styled-components";
import { ProTable } from "@ant-design/pro-components/es";

import PageWrapper from "src/framework/component/page-wrapper";
import { clientTypeMap, getClient } from "src/apps/admin/api/client";
import InfoItem from "src/framework/component/info-item";

import Title from "src/framework/component/title";
import { getClientContactList } from "src/apps/admin/api/client-concat";
import useSearchTable from "src/hooks/use-search-table";
import { getBankAccountList } from "src/apps/admin/api/bank-account";

import DetailSaleContract from "./components/detail-sale-contract";
import DetailSaleOrder from "./components/detail-sale-order";
import DetailSaleDeliver from "./components/detail-sale-deliver";
import DetailSaleReturn from "./components/detail-sale-return";
import DetailConcat from "./components/detail-concat";
import DetailBankAccount from "./components/detail-bank-account";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as Client["id"];

  const theme = useTheme();

  const [detail, setDetail] = useState<Client>();

  const getDetail = useCallback(
    function () {
      getClient({ id: Number(id) }).then((res) => {
        setDetail(res.data);
      });
    },
    [id]
  );

  useEffect(() => {
    getDetail();
  
 
  }, []);

  return (
    <PageWrapper className={className}>
      <Title id="基本信息">基本信息</Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="280px">
            <InfoItem label="客户">{detail.name}</InfoItem>
          </Col>
          <Col flex="280px">
            <InfoItem label="简称">{detail.short_name}</InfoItem>
          </Col>
          <Col flex="280px">
            <InfoItem label="类型">
              {clientTypeMap.get(detail.type)?.text}
            </InfoItem>
          </Col>
          <Col flex="280px">
            <InfoItem label="详细地址">{detail.address}</InfoItem>
          </Col>
          <Col flex="280px">
            <InfoItem label="是否签约">{detail.is_sign ? "是" : "否"}</InfoItem>
          </Col>
        </Row>
      )}
      <Title style={{ marginTop: theme.margin }} id="联系人">
        联系人
      </Title>

      <DetailConcat id={id} />

      <Title style={{ marginTop: theme.margin }} id="账号信息">
        账号信息
      </Title>
      <DetailBankAccount id={id} />

      <Title style={{ marginTop: theme.margin }} id="销售合同">
        销售合同
      </Title>

      <DetailSaleContract id={id} />

      <Title style={{ marginTop: theme.margin }} id="销售订单">
        销售订单
      </Title>

      <DetailSaleOrder id={id} />
      <Title style={{ marginTop: theme.margin }} id="销售发货">
        销售发货
      </Title>

      <DetailSaleDeliver id={id} />

      <Title style={{ marginTop: theme.margin }} id="销售退货">
        销售退货
      </Title>

      <DetailSaleReturn id={id} />

      <Title style={{ marginTop: theme.margin }} id="系统信息">
        系统信息
      </Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="280px">
            <InfoItem label="创建人">{detail.created_user?.name}</InfoItem>
          </Col>
          <Col flex="280px">
            <InfoItem label="创建时间">
              {detail.created_user?.created_at}
            </InfoItem>
          </Col>
          <Col flex="280px">
            <InfoItem label="更新时间">
              {detail.created_user?.updated_at}
            </InfoItem>
          </Col>
        </Row>
      )}

      <Anchor
        className="anchor"
        replace
        offsetTop={theme.padding}
        items={[
          "基本信息",
          "联系人",
          "账号信息",
          "销售合同",
          "销售订单",
          "销售发货",
          "销售退货",
          "系统信息",
        ].map((item) => ({
          key: item,
          title: item,
          href: `#${item}`,
        }))}
      />
    </PageWrapper>
  );
}

export default styled(Detail)`
  padding-right: 200px;

  .anchor {
    position: fixed;
    top: ${(props) => props.theme.margin}px;
    right: 50px;
  }
`;
