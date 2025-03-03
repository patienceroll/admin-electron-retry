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
import Title from "src/framework/component/title";
import {
  approval,
  billInvalid,
  businessOpportunitySetup,
  BusinessOpportunityStatus,
  cancelOperate,
  getBusinessOpportunity,
  getOperateRecord,
  startApproval,
} from "src/apps/admin/api/business-opportunity";
import InfoItem from "src/framework/component/info-item";
import Money from "src/util/money";
import { watherMap } from "src/apps/admin/api/general";
import useSearchTable, { tableColumn } from "src/hooks/use-search-table";
import { clientTypeMap, getClientList } from "src/apps/admin/api/client";
import useOption from "src/hooks/use-option";
import {
  getApprovalRecord,
  getProjectFollowOption,
  projectFollowStatus,
} from "src/apps/admin/api/project-follow";
import Icon from "src/framework/component/icon";
import ApprovalSvg from "src/assets/svg/审批.svg";
import LixiangSvg from "src/assets/svg/立项.svg";
import ZuofeiSvg from "src/assets/svg/作废.svg";
import CancelSvg from "src/assets/svg/撤销.svg";
import getApproval from "src/b-hooks/get-approval";
import contextedMessage from "src/framework/component/contexted-message";
import contextedModal from "src/framework/component/contexted-modal";
import OperateRecord from "src/b-components/operate-record";
import ApprovalRecord from "src/b-components/approval-record";
import BusinessFile from "src/b-components/business-file";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as BusinessOpportunity["id"];

  const [detail, setDetail] = useState<BusinessOpportunity>();

  const theme = useTheme();
  const table = useSearchTable(getClientList);
  const [projectFollow] = useOption(getProjectFollowOption);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const column = table.column([
    {
      title: "单位",
      dataIndex: "name",
    },
    {
      title: "类型",
      dataIndex: "type",
      valueEnum: clientTypeMap,
    },
    {
      title: "性质",
      dataIndex: "nature",
    },
    {
      title: "地址",
      dataIndex: "address",
      ellipsis: true,
    },
  ]);

  const expandColumn = tableColumn<NonNullable<Client["contact"]>[number]>([
    { title: "联系人", dataIndex: "name" },
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
  ]);

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

  useEffect(() => {
    table.extraParams.current.business_opportunity_id = id;
    table.reload();

    projectFollow.params.business_opportunity_id = id;
    projectFollow.loadOption();
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
            <InfoItem label="审批中">
              <Tag color={watherMap.get(detail.is_importance)?.color}>
                {watherMap.get(detail.is_importance)?.text}
              </Tag>
            </InfoItem>
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
            <InfoItem label="地址"> {detail.address}</InfoItem>
          </Col>
          <Col flex="100%">
            <InfoItem label="备注" contentStyle={{ whiteSpace: "pre-wrap" }}>
              {detail.remark}
            </InfoItem>
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
            <InfoItem
              label="建设内容"
              contentStyle={{ whiteSpace: "pre-wrap" }}
            >
              {detail.build_content}
            </InfoItem>
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

      <Title style={{ marginTop: theme.margin }} id="附件信息">
        附件信息
      </Title>

      {detail && (
        <div style={{ marginTop: theme.margin }}>
          <BusinessFile
            id={id}
            maxCount={1}
            service="business-opportunity"
            identify="业务机会附件"
            isCover={1}
            files={detail.file["业务机会附件"]}
          />
        </div>
      )}

      <Title style={{ marginTop: theme.margin }} id="跟进记录">
        跟进记录
      </Title>

      {projectFollow.list.map((i) => (
        <Timeline
          key={i.id}
          items={[
            {
              children: (
                <>
                  <p style={{ marginBottom: "0.5em" }}>
                    跟进人：{i.staff?.name}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Tag color={projectFollowStatus.get(i.status)?.color}>
                      {projectFollowStatus.get(i.status)?.text}
                    </Tag>
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>
                    计划时间：{i.plan_start_time} ~ {i.plan_finish_time}
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>内容：{i.content}</p>
                  <p style={{ marginBottom: "0.5em" }}>
                    跟进时间：{i.start_time} ~ {i.finish_time}
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>成果：{i.result}</p>
                  <p style={{ marginBottom: "0.5em" }}>问题反馈：{i.problem}</p>
                  <p style={{ marginBottom: "0.5em" }}>
                    点评人：{i.lead_staff?.name}
                    &nbsp;&nbsp;&nbsp;&nbsp; 评分：
                    <Rate disabled value={i.score} />
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>
                    点评内容：{i.evaluate}
                  </p>
                </>
              ),
            },
          ]}
        />
      ))}

      <Title style={{ marginTop: theme.margin }} id="单位及联系人">
        单位及联系人
      </Title>

      <ProTable
        rowKey="id"
        style={{ marginTop: theme.margin }}
        search={false}
        loading={table.loading}
        options={table.options}
        dataSource={table.dataSource}
        pagination={table.pagination}
        onChange={table.onChange}
        columns={column}
        scroll={{
          x: table.measureColumnWidth(column) + theme.padding,
          y: "60vh",
        }}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange(expandedKeys) {
            setExpandedKeys([...expandedKeys]);
          },
          rowExpandable(row) {
            return !!row.contact;
          },
          expandedRowRender(row) {
            if (!row.contact) return null;
            return (
              <ProTable
                search={false}
                pagination={false}
                options={false}
                dataSource={row.contact}
                columns={expandColumn}
                scroll={{ x: table.measureColumnWidth(expandColumn) }}
              />
            );
          },
        }}
      />

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
        style={{ marginTop: theme.margin }}
        id={id}
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

          {detail.btn_power.is_submit === 1 && (
            <FloatButton
              description="立项"
              icon={<Icon icon={LixiangSvg} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "立项",
                  content: "发起立项审批后将无法修改，确认提交吗?",
                  onOk() {
                    return startApproval({ id }).then(() => {
                      contextedMessage.message?.success("成功发起立项申请");
                      getDetail();
                      window.parent.postMessage("is_submit");
                    });
                  },
                });
              }}
            />
          )}

          {detail.btn_power.is_enable && (
            <FloatButton
              description="启用"
              icon={<Icon icon={LixiangSvg} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "启用",
                  content: "发起启用后，信息将传递给销售人员查看。",
                  onOk() {
                    return businessOpportunitySetup({ id }).then(() => {
                      contextedMessage.message?.success("成功启用");
                      getDetail();
                      window.parent.postMessage("is_enable");
                    });
                  },
                });
              }}
            />
          )}

          {detail.btn_power.is_invalid === 1 && (
            <FloatButton
              description="作废"
              icon={<Icon icon={ZuofeiSvg} fill={theme.colorError} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "作废",
                  content: "此业务机会将会作废，你确定要作废吗？",
                  onOk() {
                    return billInvalid({ id }).then(() => {
                      contextedMessage.message?.success("成功作废");
                      getDetail();
                      window.parent.postMessage("is_invalid");
                    });
                  },
                });
              }}
            />
          )}
          {detail.btn_power.is_cancel_operate === 1 && (
            <FloatButton
              description="撤销"
              icon={<Icon icon={CancelSvg} fill={theme.colorWarning} />}
              onClick={() => {
                contextedModal.modal?.confirm({
                  title: "撤销",
                  content: "撤销后将回到原状态，确认提交吗?",
                  onOk() {
                    return cancelOperate({ id }).then(() => {
                      contextedMessage.message?.success("成功撤销");
                      getDetail();
                      window.parent.postMessage("is_cancel_operate");
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
          "附件信息",
          "跟进记录",
          "单位及联系人",
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
