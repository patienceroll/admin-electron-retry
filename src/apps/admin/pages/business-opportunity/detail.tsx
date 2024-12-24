import styled, { useTheme } from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Col, Row, Tag, Typography, Anchor } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import Title from "src/framework/component/title";
import {
  BusinessOpportunityStatus,
  getBusinessOpportunity,
} from "src/apps/admin/api/business-opportunity";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as BusinessOpportunity["id"];

  const [detail, setDetail] = useState<BusinessOpportunity>();

  const theme = useTheme();

  const getDetail = useCallback(
    function () {
      getBusinessOpportunity({ id }).then((res) => {
        setDetail(res.data);
      });
    },
    [id]
  );

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return (
    <PageWrapper className={className}>
      <Title id="基本信息">基本信息</Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="400px">
            <InfoItem label="编号">
              <Typography.Text style={{ paddingLeft: theme.padding }} copyable>
                {detail.code}
              </Typography.Text>
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="业务机会">
              <Typography.Text style={{ paddingLeft: theme.padding }} copyable>
                {detail.name}
              </Typography.Text>
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="简称">
              <Typography.Text style={{ paddingLeft: theme.padding }} copyable>
                {detail.short_name}
              </Typography.Text>
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="类别">{detail.category}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="行业">{detail.trade}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="区域"> {detail.area?.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="项目状态"> {detail.project_status}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="资金来源"> {detail.capital_source}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="状态">
              <Tag
                style={{ marginLeft: theme.padding }}
                color={BusinessOpportunityStatus.get(detail.status)?.color}
              >
                {BusinessOpportunityStatus.get(detail.status)?.text}
              </Tag>
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="备注"> {detail.remark}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="地址"> {detail.address}</InfoItem>
          </Col>
        </Row>
      )}

      <Title style={{ marginTop: theme.margin }} id="详细信息">
        详细信息
      </Title>

      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="400px">
            <InfoItem label="挂网时间"> {detail.hang_time}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="总投资">
              {new Money(detail.investment_amount).toCNY()}
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="开标时间">{detail.bid_open_time}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="中标金额">
              {new Money(detail.win_bid_amount).toCNY()}
            </InfoItem>
          </Col>
          <Col flex="100%">
            <InfoItem label="建设内容">{detail.build_content}</InfoItem>
          </Col>
        </Row>
      )}

      <Title style={{ marginTop: theme.margin }} id="关键信息">
        关键信息
      </Title>
      <Anchor
        className="anchor"
        replace
        items={["基本信息", "详细信息", "关键信息"].map((item) => ({
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
    top: 50%;
    right: 50px;
    transform: translateY(-50%);
  }
`;
