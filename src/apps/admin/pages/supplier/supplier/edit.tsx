import styled, { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Card, Col, FloatButton, Form, Row } from "antd";
import {
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";

import PageWrapper from "src/framework/component/page-wrapper";
import { editSupplier, getSupplier } from "src/apps/admin/api/supplier";
import Title from "src/framework/component/title";
import Icon from "src/framework/component/icon";
import PostionSVG from "src/assets/svg/定位.svg";
import * as ChooseAddress from "src/framework/component/choose-address";
import EditContact from "./components/edit-contact";
import EditBankAccount from "./components/edit-bank-account";
import SaveSvg from "src/assets/svg/保存.svg";
function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as Supplier["id"];
  const theme = useTheme();

  const [detail, setDetail] = useState<Supplier>();
  const [form] = Form.useForm();
  const chooseAddressRef = ChooseAddress.createRef();

  function getDetail() {
    return getSupplier({ id }).then((res) => {
      setDetail(res.data);
      form.setFieldsValue({
        ...res.data,
      });
    });
  }

  function submit() {
    return form.validateFields().then((store) => {
      editSupplier({
        id,
        ...store,
      }).then(() => {
        window.parent.postMessage("success");
        window.close();
      });
    });
  }

  useEffect(() => {
    getDetail();
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
                name="name"
                label="供应商名称"
                rules={[{ required: true, message: "请输入供应商名称" }]}
              />
            </Col>
            <Col flex="350px">
              <ProFormText
                name="short_name"
                label="简称"
                rules={[{ required: true, message: "请输入简称" }]}
              />
            </Col>
            <Col flex="700px">
              <ProFormText
                label="地址"
                name="address"
                rules={[{ required: true, message: "请输入地址" }]}
                fieldProps={{
                  addonAfter: (
                    <Icon
                      icon={PostionSVG}
                      style={{ cursor: "pointer" }}
                      onClick={function () {
                        chooseAddressRef.current?.choose().then((res) => {
                          form.setFieldValue("address", res.address);
                        });
                      }}
                    />
                  ),
                }}
              />
            </Col>
            <Col flex="350px">
              <ProFormRadio.Group
                name="status"
                label="状态"
                options={[
                  { label: "启用", value: 1 },
                  { label: "停用", value: 0 },
                ]}
              />
            </Col>
            <Col flex="100%">
              <ProFormTextArea
                label="备注"
                name="remark"
                placeholder="请输入备注"
              />
            </Col>
          </Row>
        </Card>

        <Title style={{ marginTop: theme.margin }}>联系人</Title>
        <EditContact id={id} />
        <Title style={{ marginTop: theme.margin }}>账户信息</Title>
        <EditBankAccount id={id} />
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
      <ChooseAddress.default ref={chooseAddressRef} />
    </PageWrapper>
  );
}

export default styled(Edit)``;
