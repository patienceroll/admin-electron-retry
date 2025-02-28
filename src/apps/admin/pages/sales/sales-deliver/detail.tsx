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
  billInvalid,
  cancelOperate,
  getApprovalRecord,
  getOperateRecord,
  getSalesDeliver,
  salesDeliverStatus,
  startApproval,
} from "src/apps/admin/api/sales-deliver";
import Title from "src/framework/component/title";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";
import DetailSaleDeliverDetail from "./components/detail-sale-deliver-detail";
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
import { salesDeliverDetailRenderConfig } from "src/apps/admin/api/sales-deliver-detail";
import ProjectIntroduction from "src/b-components/project-introduction";
import ClientIntroduction from "src/b-components/client-introduction";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesOrder["id"];

  const theme = useTheme();

  const [detail, setDetail] = useState<SalesOrderDetail>();

  const [{ attrColumn, unitColumn }] = useRenderNames(
    salesDeliverDetailRenderConfig,
    {
      sales_deliver_id: id,
    },
  );

  const getDetail = useCallback(
    function () {
      getSalesDeliver({ id }).then((res) => {
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
              <InfoItem label="发货单">
                &nbsp;
                <Typography.Text copyable>{detail.code}</Typography.Text>
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="状态">
                &nbsp;
                <Tag color={salesDeliverStatus.get(detail.status)?.color}>
                  {salesDeliverStatus.get(detail.status)?.text}
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
              <InfoItem label="合同">{detail.sales_contract?.name}</InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="合同编号">
                &nbsp;
                <Typography.Text copyable>
                  {detail.sales_contract?.code}
                </Typography.Text>
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="订单编号">
                &nbsp;
                <Typography.Text copyable>
                  {detail.sales_order?.code}
                </Typography.Text>
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="收货人">{detail.receive_man}</InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="收货电话">{detail.receive_tel}%</InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="收货地址">{detail.receive_address}%</InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="金额">
                {new Money(detail.amount).toCNY()}
              </InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="单据日期">{detail.bill_date}</InfoItem>
            </Col>
            <Col flex="400px">
              <InfoItem label="负责人">{detail.staff?.name}</InfoItem>
            </Col>
            <Col flex="100%">
              <InfoItem label="备注" contentStyle={{ whiteSpace: "pre-wrap" }}>
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
      <Title style={{ marginTop: theme.margin }} id="发货明细">
        发货明细
      </Title>
      <DetailSaleDeliverDetail
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
            identify="发货单附件"
            isCover={0}
            files={detail.file["发货单附件"]}
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
                  content: "此发货单将会作废，你确定要作废吗？",
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
        items={["基本信息", "发货明细", "附件信息", "审批记录", "操作记录"].map(
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
