import styled, { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Card, Col, FloatButton, Form, Row } from "antd";
import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from "@ant-design/pro-form";
import dayjs from "dayjs";

import PageWrapper from "src/framework/component/page-wrapper";
import {
  editSalesContract,
  getSalesContract,
} from "src/apps/admin/api/sales-contract";
import Title from "src/framework/component/title";
import useOption from "src/hooks/use-option";
import { getProjectOption } from "src/apps/admin/api/project";
import { getClientOption } from "src/apps/admin/api/client";
import { getClientContactOptions } from "src/apps/admin/api/client-concat";
import useStaffTree from "src/b-hooks/use-staff-tree";
import BusinessFile from "src/b-components/business-file";
import EditSaleContractDetail from "./components/edit-sale-contract-detail";
import Icon from "src/framework/component/icon";
import SaveSvg from "src/assets/svg/保存.svg";

function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesContract["id"];

  const [detail, setDetail] = useState<SalesContractDetail>();
  const [project] = useOption(getProjectOption);
  const [client] = useOption(getClientOption);
  const [clientConcat] = useOption(getClientContactOptions);
  const { options, treeOptions } = useStaffTree();

  const theme = useTheme();
  const [form] = Form.useForm();

  function submit() {
    return form.validateFields().then((store) => {
      editSalesContract({
        id,
        ...store,
        sign_date: store.sign_date.format("YYYY-MM-DD"),
        advance_amount: store.advance_amount || 0,
      }).then(() => {
        window.parent.postMessage("success");
        window.close();
      });
    });
  }

  function getDetail() {
    getSalesContract({ id }).then((res) => {
      setDetail(res.data);
      const {
        settle_staff_id,
        sign_date,
        // advance_amount,
        // amount,
        // tax_rate,
        staff_id,
        settle_client_contact_id,
        sign_staff_id,
        client_contact_id,
      } = res.data;
      form.setFieldsValue({
        ...res.data,
        company_name: res.data.company?.name,
        sign_staff_id: sign_staff_id === 0 ? undefined : sign_staff_id,
        client_contact_id:
          client_contact_id === 0 ? undefined : client_contact_id,
        staff_id: staff_id === 0 ? undefined : staff_id,
        settle_client_contact_id:
          settle_client_contact_id === 0 ? undefined : settle_client_contact_id,

        sign_date: sign_date ? dayjs(sign_date) : undefined,
        settle_staff_id: settle_staff_id === 0 ? undefined : settle_staff_id,
      });
      clientConcat.params.client_id = res.data.client_id;
      clientConcat.loadOption();
    });
  }

  useEffect(() => {
    getDetail();
    project.loadOption();
    client.loadOption();
    options.loadOption();
  }, []);

  return (
    <PageWrapper className={className}>
      <Form
        form={form}
        layout="horizontal"
        initialValues={{ type: 1, status: 1 }}
      >
        <Title>基本信息</Title>
        <Card style={{ marginTop: theme.margin }}>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="350px">
              <ProFormText
                label="合同"
                name="name"
                rules={[{ required: true }]}
                placeholder="请输入合同名称"
              />
            </Col>
            <Col flex="350px">
              <ProFormText
                label="编号"
                name="code"
                rules={[{ required: true }]}
                readonly
              />
            </Col>
            <Col flex="350px">
              <ProFormRadio.Group
                label="类型"
                name="type"
                options={[
                  { label: "主合同", value: 1 },
                  { label: "补充协议", value: 2 },
                ]}
              />
            </Col>
            <Col flex="350px">
              <ProFormSelect<Project>
                label="项目"
                name="project_id"
                rules={[{ required: true }]}
                placeholder="请选择项目"
                options={project.list}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormSelect<
                Awaited<ReturnType<typeof getClientOption>>["data"][number]
              >
                label="客户"
                name="client_id"
                rules={[{ required: true }]}
                placeholder="请选择客户"
                options={client.list}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                  onChange: (v) => {
                    if (v) {
                      clientConcat.params.client_id = v.id;
                      clientConcat.loadOption();
                      form.setFieldsValue({ client_contact_id: undefined });
                    }
                  },
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormTreeSelect
                label="签约人"
                name="sign_staff_id"
                rules={[{ required: true }]}
                placeholder="请选择签约人"
                fieldProps={{
                  treeData: treeOptions,
                  treeNodeFilterProp: "title",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDatePicker
                label="签约日期"
                name="sign_date"
                rules={[{ required: true }]}
                placeholder="请选择签约日期"
                fieldProps={{ format: "YYYY-MM-DD", style: { width: "100%" } }}
              />
            </Col>
            <Col flex="350px">
              <ProFormText
                label="签约地点"
                name="sign_address"
                rules={[{ required: true }]}
                placeholder="请输入签约地点"
              />
            </Col>
            <Col flex="350px">
              <ProFormDigit
                label="税率"
                name="tax_rate"
                rules={[{ required: true }]}
                fieldProps={{
                  min: 0,
                  max: 100,
                  precision: 0,
                  style: { width: "100%" },
                  placeholder: "请输入税率",
                  suffix: "%",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDigit
                label="预付款比例"
                name="advance_ratio"
                rules={[{ required: true }]}
                fieldProps={{
                  min: 0,
                  max: 100,
                  precision: 0,
                  style: { width: "100%" },
                  placeholder: "请输入预付款比例",
                  suffix: "%",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDigit
                label="质保金比例"
                name="quality_ratio"
                rules={[{ required: true }]}
                fieldProps={{
                  min: 0,
                  max: 100,
                  precision: 0,
                  style: { width: "100%" },
                  placeholder: "请输入质保金比例",
                  suffix: "%",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormRadio.Group
                label="厂家配送"
                name="is_factory_dispatch"
                rules={[{ required: true }]}
                options={[
                  { label: "否", value: 0 },
                  { label: "是", value: 1 },
                ]}
              />
            </Col>
            <Col flex="700px">
              <ProFormTextArea
                name="remark"
                label="备注"
                placeholder="请输入备注"
              />
            </Col>
          </Row>
        </Card>

        <Title style={{ marginTop: theme.margin }}>联系人</Title>
        <Card style={{ marginTop: theme.margin }}>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="350px">
              <ProFormSelect<any>
                label="甲方负责人"
                name="client_contact_id"
                placeholder="请选择甲方负责人"
                options={clientConcat.list}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormSelect<any>
                label="甲方结算人员"
                name="settle_client_contact_id"
                placeholder="请选择甲方结算人员"
                options={clientConcat.list}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormTreeSelect
                label="乙方负责人"
                name="staff_id"
                rules={[{ required: true }]}
                placeholder="请选择负责人"
                fieldProps={{
                  treeData: treeOptions,
                  treeNodeFilterProp: "title",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormTreeSelect
                label="乙方结算人员"
                name="settle_staff_id"
                rules={[{ required: true }]}
                placeholder="请选择乙方结算人员"
                fieldProps={{
                  treeData: treeOptions,
                  treeNodeFilterProp: "title",
                }}
              />
            </Col>
          </Row>
        </Card>

        <Title style={{ marginTop: theme.margin }}>结算方式</Title>
        <Card style={{ marginTop: theme.margin }}>
          <ProFormTextArea
            name="settle_type"
            placeholder="请输入结算方式"
            rules={[{ required: true }]}
            fieldProps={{ style: { height: "200px" } }}
          />
        </Card>

        <Title style={{ marginTop: theme.margin }}>产品明细</Title>
        <EditSaleContractDetail id={id} />

        <Title style={{ marginTop: theme.margin }}>附件信息</Title>
        {detail && (
          <Card style={{ marginTop: theme.margin }}>
            <BusinessFile
              id={id}
              service="sales-contract"
              identify="合同附件"
              isCover={0}
              files={detail.file["合同附件"]}
            />
          </Card>
        )}
      </Form>

      {detail && (
        <FloatButton
          icon={<Icon icon={SaveSvg} />}
          description="保存"
          shape="square"
          style={{ insetInlineEnd: 24 }}
          onClick={submit}
        />
      )}
    </PageWrapper>
  );
}

export default styled(Edit)``;
