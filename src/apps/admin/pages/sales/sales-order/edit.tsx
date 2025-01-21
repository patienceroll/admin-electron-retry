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
import { getSalesOrder } from "src/apps/admin/api/sales-order";
import Title from "src/framework/component/title";
import Icon from "src/framework/component/icon";
import SaveSvg from "src/assets/svg/保存.svg";
import useOption from "src/hooks/use-option";
import { getProjectOption } from "src/apps/admin/api/project";
import { getSalesContractOption } from "src/apps/admin/api/sales-contract";
import { getClientOption } from "src/apps/admin/api/client";
import useStaffTree from "src/b-hooks/use-staff-tree";
import BusinessFile from "src/b-components/business-file";
import EditSaleOrderDetail from "./components/edit-sale-order-detail";

function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesOrder["id"];
  const theme = useTheme();
  const [detail, setDetail] = useState<SalesOrder>();
  const [form] = Form.useForm();

  const [project] = useOption(getProjectOption);
  const [salesContract] = useOption(getSalesContractOption);
  const [client] = useOption(getClientOption);
  const { options, treeOptions } = useStaffTree();

  function getDetail() {
    return getSalesOrder({ id }).then((res) => {
      setDetail(res.data);
      const {
        bill_date,

        staff_id,
        sales_contract_id,
        client_id,
      } = res.data;
      form.setFieldsValue({
        ...res.data,
        company_name: res.data.company?.name,
        staff_id: staff_id === 0 ? undefined : staff_id,
        sales_contract_id:
          sales_contract_id === 0 ? undefined : sales_contract_id,
        client_id: client_id === 0 ? undefined : client_id,
        bill_date: bill_date ? dayjs(bill_date) : null,
      });
    });
  }

  function submit() {
    return form.validateFields().then((store) => {});
  }

  useEffect(() => {
    getDetail();
    project.load();
    salesContract.load();
    client.load();
    options.load();
  }, []);

  return (
    <PageWrapper className={className}>
      <Form
        form={form}
        layout="horizontal"
        initialValues={{ type: 1, status: 1 }}
      >
        <Title id="基本信息">基本信息</Title>
        <Card style={{ marginTop: theme.margin }}>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="350px">
              <ProFormSelect<Project>
                placeholder="请选择项目"
                label="项目"
                name="project_id"
                options={project.list}
                rules={[{ required: true, message: "请选择项目" }]}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormSelect<SalesContract>
                placeholder="请选择销售合同"
                label="销售合同"
                name="sales_contract_id"
                options={salesContract.list}
                rules={[{ required: true, message: "请选择销售合同" }]}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormText label="编号" name="code" readonly />
            </Col>
            <Col flex="350px">
              <ProFormSelect<SalesContract>
                placeholder="请选择客户"
                label="客户"
                name="client_id"
                options={client.list}
                rules={[{ required: true, message: "请选择客户" }]}
                fieldProps={{
                  fieldNames: { label: "name", value: "id" },
                  filterOption: true,
                  showSearch: true,
                  optionFilterProp: "name",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDatePicker
                placeholder="请选择单据日期"
                label="单据日期"
                name="bill_date"
                rules={[{ required: true, message: "请选择单据日期" }]}
                fieldProps={{
                  format: "YYYY-MM-DD",
                  allowClear: true,
                  style: { width: "100%" },
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormTreeSelect
                placeholder="请选择负责人"
                label="负责人"
                name="staff_id"
                rules={[{ required: true, message: "请选择负责人" }]}
                fieldProps={{
                  treeData: treeOptions,
                  allowClear: true,
                  treeNodeFilterProp: "title",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDigit
                label="预付款比例"
                name="advance_ratio"
                min={0}
                placeholder="请输入预付款比例"
                fieldProps={{
                  step: "0.00",
                  precision: 0,
                  suffix: "%",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDigit
                label="质保金比例"
                name="quality_ratio"
                min={0}
                placeholder="请输入质保金比例"
                fieldProps={{
                  step: "0.00",
                  precision: 0,
                  suffix: "%",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormDigit
                label="税率"
                name="tax_rate"
                min={0}
                placeholder="请输入税率"
                fieldProps={{
                  step: "0.00",
                  precision: 0,
                  suffix: "%",
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormRadio.Group
                name="is_urgent"
                label="是否加急"
                options={[
                  { label: "是", value: 1 },
                  { label: "否", value: 0 },
                ]}
              />
            </Col>
            <Col flex="350px">
              <ProFormRadio.Group
                name="is_delay"
                label="是否延期"
                options={[
                  { label: "是", value: 1 },
                  { label: "否", value: 0 },
                ]}
              />
            </Col>
            <Col flex="700px">
              <ProFormTextArea
                label="备注"
                name="remark"
                allowClear
                placeholder="请输入备注"
              />
            </Col>
            {detail && (
              <Col flex="700px">
                <Form.Item label="附件信息">
                  <BusinessFile
                    service="sales-order"
                    identify="销售订单"
                    isCover={0}
                    id={id}
                    files={detail.file['销售订单']}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>
      </Form>

      <Title style={{ flex: 1, marginTop: theme.margin }}>产品明细</Title>

      <EditSaleOrderDetail id={id} />

      {detail && (
        <FloatButton
          icon={<Icon icon={SaveSvg} />}
          tooltip="保存"
          shape="square"
          style={{ insetInlineEnd: 24 }}
          onClick={submit}
        />
      )}
    </PageWrapper>
  );
}

export default styled(Edit)``;
