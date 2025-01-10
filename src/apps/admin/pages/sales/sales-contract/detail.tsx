import styled, { useTheme } from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Col, Row, Tag, Typography, Anchor, FloatButton } from "antd";

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
  salesContractType,
  startApproval,
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

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesContract["id"];

  const theme = useTheme();

  const [detail, setDetail] = useState<SalesContractDetail>();

  const [_, attrCoumn, unitColumn] = useRenderNames(
    salesContractDetailRenderConfig,
    {
      sales_contract_id: id,
    }
  );

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
      <DetailSaleContractDetail
        id={id}
        attrCoumn={attrCoumn}
        unitColumn={unitColumn}
      />

      <Title style={{ marginTop: theme.margin }} id="销售订单">
        销售订单
      </Title>
      <DetailSaleOrder id={id} attrCoumn={attrCoumn} unitColumn={unitColumn} />

      <Title style={{ marginTop: theme.margin }} id="销售发货">
        销售发货
      </Title>
      <DetailSaleDeliver
        id={id}
        attrCoumn={attrCoumn}
        unitColumn={unitColumn}
      />

      <Title style={{ marginTop: theme.margin }} id="销售退货">
        销售退货
      </Title>
      <DetailSaleReturn id={id} attrCoumn={attrCoumn} unitColumn={unitColumn} />

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

      {detail && (
        <FloatButton.Group shape="square">
          {detail.btn_power.is_submit && (
            <FloatButton
              tooltip="提审"
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
          {detail.btn_power.is_approve && (
            <FloatButton
              tooltip="审批"
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
          {detail.btn_power.is_invalid && (
            <FloatButton
              tooltip="作废"
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
          {detail.btn_power.is_suspend && (
            <FloatButton
              tooltip="中止"
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
          {detail.btn_power.is_end && (
            <FloatButton
              tooltip="完结"
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
            />
          )}
          {detail.btn_power.is_cancel_operate && (
            <FloatButton
              tooltip="撤销"
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
