import styled, { useTheme } from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
  Anchor,
  Card,
  Col,
  Divider,
  FloatButton,
  Row,
  Tag,
  Typography,
} from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import {
  approval,
  billEnd,
  billInvalid,
  billSuspend,
  cancelOperate,
  getApprovalRecord,
  getOperateRecord,
  getSalesContract,
  salesContractStatus,
  salesContractType,
  startApproval,
} from "src/apps/admin/api/sales-contract";
import Title from "src/framework/component/title";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";
import DetailSaleContractDetail from "./components/detail-sale-contract-detail";
import BusinessFile from "src/b-components/business-file";
import ApprovalRecord from "src/b-components/approval-record";
import OperateRecord from "src/b-components/operate-record";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";
import Icon from "src/framework/component/icon";
import ApprovalSvg from "src/assets/svg/审批.svg";
import SubmitSvg from "src/assets/svg/提审.svg";
import StopSvg from "src/assets/svg/终止.svg";
import FinishSvg from "src/assets/svg/完结.svg";
import getApproval from "src/b-hooks/get-approval";
import useRenderNames from "src/b-hooks/use-render-names";
import { salesContractDetailRenderConfig } from "src/apps/admin/api/sales-contract-detail";
import ProjectIntroduction from "src/b-components/project-introduction";
import ClientIntroduction from "src/b-components/client-introduction";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesContract["id"];

  const theme = useTheme();

  const [detail, setDetail] = useState<SalesContractDetail>();

  const [{ attrColumn, unitColumn }] = useRenderNames(
    salesContractDetailRenderConfig,
    {
      sales_contract_id: id,
    },
  );

  const getDetail = useCallback(
    function () {
      getSalesContract({ id }).then((res) => {
        setDetail(res.data);
      });
    },
    [id],
  );

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return (
    <PageWrapper className={className}>
      <Title id="基本信息">基本信息</Title>

      <Card style={{ marginTop: theme.margin }}>
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
              <InfoItem label="状态">
                &nbsp;
                <Tag color={salesContractStatus.get(detail.status)?.color}>
                  {salesContractStatus.get(detail.status)?.text}
                </Tag>
                {detail.is_approve === 1 && <Tag color="#d46b08">审批中</Tag>}
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="项目">
                <span style={{ paddingLeft: theme.padding }}>
                  <ProjectIntroduction id={detail.project_id}>
                    <span style={{ color: theme.colorLink, cursor: "pointer" }}>
                      {detail.project?.name_show}
                    </span>
                  </ProjectIntroduction>
                </span>
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="客户">
                <span style={{ paddingLeft: theme.padding }}>
                  <ClientIntroduction id={detail.client_id}>
                    <span style={{ color: theme.colorLink, cursor: "pointer" }}>
                      {detail.client?.name_show}
                    </span>
                  </ClientIntroduction>
                </span>
              </InfoItem>
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
            <Col flex="400px">
              <InfoItem label="是否厂家配送">
                {detail.is_factory_dispatch ? "是" : "否"}
              </InfoItem>
            </Col>
            <Divider style={{ margin: 0 }} />
            <Col flex="400px">
              <InfoItem label="金额">
                {new Money(detail.amount).toCNY()}
              </InfoItem>
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
            <Divider style={{ margin: 0 }} />
            <Col flex="400px">
              <InfoItem label="甲方负责人">
                {detail.client_contact?.name} {detail.client_contact?.phone}
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="乙方负责人">
                {detail.staff?.name} {detail.staff?.phone}
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="甲方结算人员">
                {detail.settle_client_contact?.name}
                {detail.settle_client_contact?.phone}
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="乙方结算人员">
                {detail.settle_staff?.name} {detail.settle_staff?.phone}
              </InfoItem>
            </Col>
            <Divider style={{ margin: 0 }} />

            <Col flex="100%">
              <InfoItem
                label="结算方式"
                contentStyle={{ whiteSpace: "pre-wrap" }}
              >
                {detail.settle_type}
              </InfoItem>
            </Col>
            <Divider style={{ margin: 0 }} />
            <Col flex="100%">
              <InfoItem
                label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注"
                contentStyle={{ whiteSpace: "pre-wrap" }}
              >
                {detail.remark}
              </InfoItem>
            </Col>
            <Divider style={{ margin: 0 }} />
            <Col flex="400px">
              <InfoItem label="创建人">{detail.created_user?.name}</InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="创建时间">{detail.created_at}</InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="更新时间">{detail.updated_at}</InfoItem>
            </Col>
          </Row>
        )}
      </Card>
      <Title style={{ marginTop: theme.margin }} id="合同明细">
        合同明细
      </Title>
      <DetailSaleContractDetail
        id={id}
        attrCoumn={attrColumn}
        unitColumn={unitColumn}
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

      {detail && (
        <FloatButton.Group shape="square">
          {detail.btn_power.is_submit === 1 && (
            <FloatButton
              description="提审"
              icon={<Icon icon={SubmitSvg} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "提审",
                  content: "提交审批后将无法修改，确认提交吗?",
                  onOk() {
                    return startApproval({ id }).then(() => {
                      getDetail();
                      window.parent.postMessage("is_submit");
                      contextedMessage.message?.success("成功提审");
                    });
                  },
                });
              }}
            />
          )}
          {detail.btn_power.is_approve === 1 && (
            <FloatButton
              description="审批"
              icon={<Icon icon={ApprovalSvg} />}
              onClick={() => {
                getApproval()
                  .then((result) => approval({ ...result, id }))
                  .then(() => {
                    contextedMessage.message?.success("成功审批");
                    getDetail();
                    window.parent.postMessage("is_approve");
                  });
              }}
            />
          )}
          {detail.btn_power.is_invalid === 1 && (
            <FloatButton
              description="作废"
              icon={<Icon icon={StopSvg} fill={theme.colorError} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "作废",
                  content: "此合同将会作废，你确定要作废吗？",
                  onOk() {
                    return billInvalid({ id }).then(() => {
                      getDetail();
                      window.parent.postMessage("is_invalid");
                      contextedMessage.message?.success("成功作废");
                    });
                  },
                });
              }}
            />
          )}
          {detail.btn_power.is_suspend === 1 && (
            <FloatButton
              description="中止"
              icon={<Icon icon={StopSvg} fill={theme.colorError} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "中止",
                  content: "你确定要中止该合同吗？",
                  onOk() {
                    return billSuspend({ id }).then(() => {
                      getDetail();
                      window.parent.postMessage("is_suspend");
                      contextedMessage.message?.success("成功中止");
                    });
                  },
                });
              }}
            />
          )}
          {detail.btn_power.is_end === 1 && (
            <FloatButton
              icon={<Icon icon={FinishSvg} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "完结",
                  content: "你确定要完结该合同吗？",
                  onOk() {
                    return billEnd({ id }).then(() => {
                      getDetail();
                      window.parent.postMessage("is_end");
                      contextedMessage.message?.success("成功完结");
                    });
                  },
                });
              }}
              description="完结"
            />
          )}
          {detail.btn_power.is_cancel_operate === 1 && (
            <FloatButton
              description="撤销"
              icon={<Icon icon={FinishSvg} fill={theme.colorWarning} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "撤销",
                  content: "撤销后将回到原状态，确认提交吗?",
                  onOk() {
                    return cancelOperate({ id }).then(() => {
                      getDetail();
                      window.parent.postMessage("is_cancel_operate");
                      contextedMessage.message?.success("成功撤销");
                    });
                  },
                });
              }}
            />
          )}
        </FloatButton.Group>
      )}

      <Anchor
        className="anchor"
        replace
        offsetTop={theme.padding}
        items={["基本信息", "合同明细", "附件信息", "审批记录", "操作记录"].map(
          (item) => ({
            key: item,
            title: item,
            href: `#${item}`,
          }),
        )}
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
