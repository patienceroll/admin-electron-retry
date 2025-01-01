import React, { useCallback, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useLocation } from "react-router";
import { Col, Row, Tag, Anchor, Descriptions, FloatButton } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import {
  approval,
  billEnd,
  billInvalid,
  billSuspend,
  cancel,
  cancelOperate,
  getApprovalRecord,
  getOperateRecord,
  getProject,
  ProjectStatusMap,
  startApproval,
} from "src/apps/admin/api/project";
import Title from "src/framework/component/title";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";
import { watherMap } from "src/apps/admin/api/general";
import useSearchTable from "src/hooks/use-search-table";
import { getClientList } from "src/apps/admin/api/client";
import DetailConcatList from "./components/detail-concat-list";
import BusinessFile from "src/b-components/business-file";
import DetailSaleContract from "./components/detail-sale-contract";
import DetailSaleOrder from "./components/detail-sale-order";
import DetailSaleDeliver from "./components/detail-sale-deliver";
import DetailSaleReturn from "./components/detail-sale-return";
import OperateRecord from "src/b-components/operate-record";
import ApprovalRecord from "src/b-components/approval-record";
import Icon from "src/framework/component/icon";
import ApprovalSvg from "src/assets/svg/审批.svg";
import SubmitSvg from "src/assets/svg/提审.svg";
import GiveUpSvg from "src/assets/svg/放弃.svg";
import StopSvg from "src/assets/svg/终止.svg";
import FinishSvg from "src/assets/svg/完结.svg";
import getApproval from "src/b-hooks/get-approval";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";

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

      <Title style={{ marginTop: theme.margin }} id="系统信息">
        系统信息
      </Title>
      {detail && (
        <Row
          style={{ marginTop: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="400px">
            <InfoItem label="创建人">{detail.created_user?.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="负责人"> {detail.staff?.name}</InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="创建时间">
              {detail.created_user?.created_at}
            </InfoItem>
          </Col>
          <Col flex="400px">
            <InfoItem label="更新时间">
              {detail.created_user?.updated_at}
            </InfoItem>
          </Col>
        </Row>
      )}

      {detail && (
        <FloatButton.Group shape="square">
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
          {detail.btn_power.is_cancel && (
            <FloatButton
              tooltip="放弃"
              icon={<Icon icon={GiveUpSvg} fill={theme.colorWarning} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "申请放弃",
                  content: "确认申请放弃吗？",
                  onOk() {
                    return cancel({ id }).then(() => {
                      getDetail();
                      window.parent.postMessage("is_cancel");
                      contextedMessage.message?.success("成功发起取消申请");
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
                  content: "你确定要中止该项目吗？",
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
          {detail.btn_power.is_invalid && (
            <FloatButton
              tooltip="作废"
              icon={<Icon icon={StopSvg} fill={theme.colorError} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "作废",
                  content: "此项目将会作废，你确定要作废吗？",
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
          {detail.btn_power.is_end && (
            <FloatButton
              tooltip="完结"
              icon={<Icon icon={FinishSvg} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "完结",
                  content: "你确定要完结该项目吗？",
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
          "详细信息",
          "关键信息",
          "单位及联系人",
          "相关信息",
          "销售合同",
          "销售订单",
          "销售退货",
          "审批记录",
          "操作记录",
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
