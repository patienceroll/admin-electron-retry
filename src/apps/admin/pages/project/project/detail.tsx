import React, { useCallback, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
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
  Collapse,
  Steps,
  StepsProps,
  Space,
  Avatar,
  Descriptions,
} from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import { getProject, ProjectStatusMap } from "src/apps/admin/api/project";
import Title from "src/framework/component/title";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";
import { watherMap } from "src/apps/admin/api/general";
import useSearchTable from "src/hooks/use-search-table";
import { getClientList } from "src/apps/admin/api/client";
import DetailConcatList from "./components/detail-concat-list";
import BusinessFile from "src/b-components/business-file";
import DetailSaleContract from "./components/detail-sale-contract";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as Project["id"];

  const theme = useTheme();
  const [detail, setDetail] = useState<ProjectDetail>();

  const clientConcatList = useSearchTable(getClientList);

  const getDetail = useCallback(
    function () {
      getProject({ id }).then((res) => {
        setDetail(res.data);
      });
    },
    [id]
  );

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(() => {
    clientConcatList.extraParams.current.project_id = id;
    clientConcatList.reload();
  }, []);

  return (
    <PageWrapper className={className}>
      <Title id="基本信息">基本信息</Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="400px">
            <InfoItem label="编号">{detail.code}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="项目">{detail.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="简称">{detail.short_name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="类别">{detail.category}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="行业">{detail.trade}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="项目状态">{detail.project_status}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="资金来源">{detail.capital_source}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="状态">
              &nbsp;
              <Tag color={ProjectStatusMap.get(detail.status)?.color}>
                {ProjectStatusMap.get(detail.status)?.text}
              </Tag>
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="备注">{detail.remark}</InfoItem>
          </Col>
          <Col flex="800px">
            <InfoItem label="地址">{detail.address}</InfoItem>
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

      {detail && (
        <Row
          style={{ margin: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="400px">
            <InfoItem label="采预计购时间">{detail.purchase_date}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="机会价值">
              {new Money(detail.estimated_amount).toCNY()}
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="是否重点">
              &nbsp;
              <Tag color={watherMap.get(detail.is_importance)?.color}>
                {watherMap.get(detail.is_importance)?.text}
              </Tag>
            </InfoItem>
          </Col>
        </Row>
      )}

      <Title style={{ marginTop: theme.margin }} id="单位及联系人">
        单位及联系人
      </Title>

      <DetailConcatList id={id} />

      <Title style={{ marginTop: theme.margin }} id="相关信息">
        相关信息
      </Title>

      {detail && (
        <Descriptions style={{ marginTop: theme.margin }}>
          <Descriptions.Item label="工程概览">
            <BusinessFile
              identify="工程概览"
              service="project"
              isCover={0}
              id={id}
              files={detail.file["工程概览"]}
            />
          </Descriptions.Item>
          <Descriptions.Item label="现场照片">
            <BusinessFile
              identify="现场照片"
              service="project"
              isCover={0}
              id={id}
              files={detail.file["现场照片"]}
            />
          </Descriptions.Item>
          <Descriptions.Item label="其他附件">
            <BusinessFile
              identify="项目附件"
              service="project"
              isCover={0}
              id={id}
              files={detail.file["项目附件"]}
            />
          </Descriptions.Item>
        </Descriptions>
      )}

      <Title style={{ marginTop: theme.margin }} id="销售合同">
        销售合同
      </Title>

      <DetailSaleContract id={id} />

      <Anchor
        className="anchor"
        replace
        offsetTop={theme.padding}
        items={[
          "基本信息",
          "详细信息",
          "关键信息",
          "单位及联系人",
          "相关信息",
          "销售合同"
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
    top: 20%;
    right: 50px;
    transform: translateY(-50%);
  }
`;
