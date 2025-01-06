import styled, { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Card, Col, Form, Row } from "antd";
import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from "@ant-design/pro-form";
import dayjs from "dayjs";

import PageWrapper from "src/framework/component/page-wrapper";
import { getSalesContract } from "src/apps/admin/api/sales-contract";
import Title from "src/framework/component/title";
import useOption from "src/hooks/use-option";
import { getProjectOption } from "src/apps/admin/api/project";
import { getClientOption } from "src/apps/admin/api/client";
import { getClientContactOptions } from "src/apps/admin/api/client-concat";
import useStaffTree from "src/b-hooks/use-staff-tree";

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
                required
                placeholder="请输入合同名称"
              />
            </Col>
            <Col flex="350px">
              <ProFormText label="编号" name="code" required readonly />
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
                required
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
                required
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
              <ProFormText
                label="签约地点"
                name="sign_address"
                required
                placeholder="请输入签约地点"
              />
            </Col>
            <Col flex="350px">
              <ProFormDatePicker
                label="签约日期"
                name="sign_date"
                required
                placeholder="请选择签约日期"
                fieldProps={{ format: "YYYY-MM-DD", style: { width: "100%" } }}
              />
            </Col>
            <Col flex="350px">
              <ProFormTreeSelect
                label="签约人"
                name="sign_staff_id"
                required
                placeholder="请选择签约人"
                fieldProps={{
                  treeData: treeOptions,
                  treeNodeFilterProp: "title",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormTreeSelect
                label="负责人"
                name="staff_id"
                required
                placeholder="请选择负责人"
                fieldProps={{
                  treeData: treeOptions,
                  treeNodeFilterProp: "title",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDigit
                label="税率"
                name="tax_rate"
                required
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
                required
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
                required
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
                required
                options={[
                  { label: "否", value: 0 },
                  { label: "是", value: 1 },
                ]}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </PageWrapper>
  );
}

export default styled(Edit)``;
