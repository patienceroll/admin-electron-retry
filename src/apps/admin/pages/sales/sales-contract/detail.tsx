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
  getApprovalRecord,
  getOperateRecord,
  getSalesContract,
  salesContractType,
} from "src/apps/admin/api/sales-contract";
import Title from "src/framework/component/title";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";
import DetailSaleContractDetail from "./components/detail-sale-contract-detail";
import BusinessFile from "src/b-components/business-file";
import DetailSaleOrder from "./components/detail-sale-order";
import DetailSaleDeliver from "./components/detail-sale-deliver";
import DetailSaleReturn from "./components/detail-sale-return";
import ApprovalRecord from "src/b-components/approval-record";
import OperateRecord from "src/b-components/operate-record";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesContract["id"];

  const theme = useTheme();

  const [detail, setDetail] = useState<SalesContractDetail>();

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
      <DetailSaleContractDetail id={id} />

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

      <Title style={{ marginTop: theme.margin }} id="审批记录">
        审批记录
      </Title>
      <ApprovalRecord
        style={{ marginTop: theme.margin }}
        id={id}
        recordApi={getApprovalRecord}
      />

      <Title style={{ marginTop: theme.margin }} id="操作记录">
        操作记录
      </Title>
      <OperateRecord
        id={id}
        style={{ marginTop: theme.margin }}
        recordApi={getOperateRecord}
      />

      <Title style={{ marginTop: theme.margin }} id="附件信息">
        附件信息
      </Title>
      {detail && (
        <div style={{ marginTop: theme.margin }}>
          <BusinessFile
            id={id}
            service="sales-contract"
            identify="合同附件"
            isCover={0}
            files={detail.file["合同附件"]}
          />
        </div>
      )}
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
        replace
        offsetTop={theme.padding}
        items={[
          "基本信息",
          "产品明细",
          "销售订单",
          "销售发货",
          "销售退货",
          "审批记录",
          "操作记录",
          "附件信息",
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
