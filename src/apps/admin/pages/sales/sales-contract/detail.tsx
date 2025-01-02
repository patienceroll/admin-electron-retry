import styled, { useTheme } from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
  Col,
  Row,
  Tag,
  Typography,
  Anchor,
  Timeline,
  Rate,
  FloatButton,
} from "antd";
import { ProTable } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import {
  getSalesContract,
  salesContractType,
} from "src/apps/admin/api/sales-contract";
import Title from "src/framework/component/title";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesContract["id"];

  const theme = useTheme();

  const [detail, setDetail] = useState<SalesContract>();

  const getDetail = useCallback(
    function () {
      getSalesContract({ id }).then((res) => {
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
            <InfoItem label="合同"> {detail.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="编号">
              &nbsp;
              <Typography.Text copyable>{detail.code}</Typography.Text>
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="类型">
              &nbsp;
              <Tag color={salesContractType.get(detail.type)?.color}>
                {salesContractType.get(detail.type)?.text}
              </Tag>
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="项目"> {detail.project?.name_show}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="客户"> {detail.client?.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="金额">{new Money(detail.amount).toCNY()}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="税率">{`${detail.tax_rate}%`}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="预付款比例">{`${detail.advance_ratio}%`}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="质保金比例">{`${detail.quality_ratio}%`}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="甲方负责人">
              {detail.client_contact?.name}
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="负责人">{detail.staff?.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="签约人">{detail.sign_staff?.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="签约日期">{detail.sign_date}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="签约地点">{detail.sign_address}</InfoItem>
          </Col>
          <Col flex="800px">
            <InfoItem label="备注">{detail.remark}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="结算方式">{detail.settle_type}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="甲方结算人员">
              {detail.settle_client_contact?.name}
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="乙方结算人员">
              {detail.settle_staff?.name}
            </InfoItem>
          </Col>
        </Row>
      )}

      <Title style={{ marginTop: theme.margin }} id="产品明细">
        产品明细
      </Title>

      <Anchor
        className="anchor"
        replace
        offsetTop={theme.padding}
        items={["基本信息", "产品明细"].map((item) => ({
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
