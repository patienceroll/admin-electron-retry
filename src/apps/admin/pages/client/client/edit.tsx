import React, { useEffect, useState } from "react";
import { useLocation } from "react-router/dist";
import styled, { useTheme } from "styled-components";
import { Col, FloatButton, Form, Input, Radio, Row, Select } from "antd/es";

import PageWrapper from "src/framework/component/page-wrapper";
import Title from "src/framework/component/title";
import AddressFormInput from "src/framework/component/address-form-input";
import { editClient, getClient } from "src/apps/admin/api/client";
import Icon from "src/framework/component/icon";
import SaveSvg from "src/assets/svg/保存.svg";
import EditConcatList from "./components/edit-concat-list";
import EditBankAccount from "./components/edit-bank-account";

function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as ClientListItem["id"];

  const [detail, setDetail] = useState<ClientListItem>();

  const [form] = Form.useForm();

  const theme = useTheme();

  function getDetail() {
    getClient({ id }).then((res) => {
      setDetail(res.data);
      const { staff_id, province, city, county, latitude, longitude, address } =
        res.data;

      form.setFieldsValue({
        ...res.data,
        staff_id: staff_id === 0 ? undefined : staff_id,
      });
      if (province && city && county && latitude && longitude && address) {
        form.setFieldValue("address", {
          province,
          city,
          county,
          latitude,
          longitude,
          address,
        });
      } else {
        form.setFieldValue("address", undefined);
      }
    });
  }

  function submit() {
    return form
      .validateFields()
      .then((store) => {
        return editClient({
          id,
          ...store,
          province: store.address.province,
          city: store.address.city,
          county: store.address.county,
          latitude: store.address.lat,
          longitude: store.address.lng,
          address: store.address.address,
        });
      })
      .then(() => {
        window.parent.postMessage("success");
        window.close();
      });
  }

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <PageWrapper className={className}>
      <Title>基本信息</Title>

      <Form
        form={form}
        layout="horizontal"
        style={{ marginTop: theme.margin }}
        initialValues={{ type: 1, status: 1 }}
      >
        <Row gutter={[theme.padding, theme.padding]}>
          <Col flex="350px">
            <Form.Item label="类型" name="type" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "施工客户", value: 1 },
                  { label: "业主客户", value: 2 },
                  { label: "设计院", value: 3 },
                  { label: "其他客户", value: 4 },
                ]}
                allowClear
                placeholder="请选择客户类型"
              />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="客户" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入客户" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item
              label="简称"
              name="short_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入简称" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="法人" name="legal_person">
              <Input placeholder="请输入法人" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="客户级别" name="grade">
              <Input placeholder="请输入客户级别" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item
              label="单位性质"
              name="nature"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入单位性质" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="成立日期" name="establishment_date">
              <Input placeholder="请输入成立日期" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="注册地址" name="registration_address">
              <Input placeholder="请输入注册地址" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="社会信用代码" name="social_credit_code">
              <Input placeholder="请输入社会信用代码" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="税务登记号" name="tax_registration_code">
              <Input placeholder="请输入税务登记号" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="主营产品或服务" name="main_business">
              <Input placeholder="请输入主营产品或服务" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="年营业额" name="annual_turnover">
              <Input placeholder="请输入年营业额" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="电话号码" name="telephone">
              <Input placeholder="请输入电话号码" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="传真号码" name="fax_number">
              <Input placeholder="请输入传真号码" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="邮箱地址" name="email_address">
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="官方网站" name="official_website">
              <Input placeholder="请输入官方网站" />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="地址" name="address" rules={[{ required: true }]}>
              <AddressFormInput />
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item label="是否签约" name="is_sign" style={{ width: "80%" }}>
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col flex="350px">
            <Form.Item name="status" label="状态">
              <Radio.Group defaultValue={1} buttonStyle="solid">
                <Radio value={0}>停用</Radio>
                <Radio value={1}>启用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Title style={{ marginTop: theme.margin }}>联系人</Title>
      <EditConcatList id={id} />

      <Title style={{ marginTop: theme.margin }}>账户信息</Title>
      <EditBankAccount id={id} />

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
