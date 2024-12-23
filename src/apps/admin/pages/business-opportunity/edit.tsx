import styled, { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Tag,
  TreeSelect,
} from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import {
  BusinessOpportunityStatus,
  getBusinessOpportunity,
  getProjectStatusText,
} from "src/apps/admin/api/business-opportunity";
import Title from "src/framework/component/title";
import FlexCenter from "src/framework/component/flex-center";
import TextSelectInput from "src/framework/component/text-select-input";
import * as ChooseAddress from "src/framework/component/choose-address";
import Icon from "src/framework/component/icon";
import PostionSVG from "src/assets/svg/定位.svg";
import MoneyInput from "src/framework/component/money-input";
import { getAreaOption } from "src/apps/admin/api/sales-territory";
import useStaffTree from "src/b-hooks/use-staff-tree";

function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as BusinessOpportunity["id"];

  const [detail, setDetail] = useState<BusinessOpportunity>();
  const [projectStatus, setProjectStatus] = useState<string[]>([]);
  const [area, setArea] = useState<Area[]>([]);

  const [form] = Form.useForm();
  const chooseAddressRef = ChooseAddress.createRef();
  const { options, treeOptions } = useStaffTree();

  const theme = useTheme();

  function getDetail() {
    getBusinessOpportunity({ id }).then((res) => {
      setDetail(res.data);
      const { staff_id, province, city, county, latitude, longitude, address } =
        res.data;

      // form.setFieldsValue({
      //   ...res.data,
      //   staff_id: staff_id === 0 ? undefined : staff_id,
      // });
      // if (province && city && county && latitude && longitude && address) {
      //   form.setFieldValue("address", {
      //     province,
      //     city,
      //     county,
      //     latitude,
      //     longitude,
      //     address,
      //   });
      // } else {
      //   form.setFieldValue("address", undefined);
      // }
    });
  }

  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    getProjectStatusText().then((res) => {
      setProjectStatus(res.data);
    });
    getAreaOption().then((res) => {
      setArea(res.data);
    });
    options.loadOption();
  }, []);

  return (
    <PageWrapper className={className}>
      <Title>
        <div className="title">
          基本信息
          {detail && (
            <FlexCenter>
              <Tag color={BusinessOpportunityStatus.get(detail.status)?.color}>
                {BusinessOpportunityStatus.get(detail.status)?.text}
              </Tag>
            </FlexCenter>
          )}
        </div>
      </Title>

      <Form
        form={form}
        layout="horizontal"
        initialValues={{ type: 1, status: 1 }}
      >
        <Card style={{ marginTop: theme.margin }}>
          <Row gutter={[theme.padding, theme.padding]}>
            <Col flex="350px">
              <Form.Item
                label="业务机会"
                name="name"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入业务机会" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="简称" name="short_name">
                <Input placeholder="请输入业务机会简称" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="类别" name="category">
                <Radio.Group>
                  <Radio value="A">A</Radio>
                  <Radio value="B">B</Radio>
                  <Radio value="C">C</Radio>
                  <Radio value="D">D</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="行业" name="trade">
                <TextSelectInput
                  autoComplete="off"
                  placeholder="请输入行业"
                  options={["水利", "市政", "房建", "工业", "交通", "能源"]}
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="项目状态" name="project_status">
                <TextSelectInput
                  autoComplete="off"
                  placeholder="请输入项目状态"
                  options={projectStatus}
                />
              </Form.Item>
            </Col>
            <Col flex="700px">
              <Form.Item label="地址" name="address">
                <Input
                  placeholder="请输入地址"
                  addonAfter={
                    <Icon
                      icon={PostionSVG}
                      style={{ cursor: "pointer" }}
                      onClick={function () {
                        chooseAddressRef.current?.choose().then((res) => {
                          form.setFieldValue("address", res.address);
                        });
                      }}
                    />
                  }
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item
                label="负责人"
                name="staff_id"
                rules={[{ required: true }]}
              >
                <TreeSelect
                  placeholder="请选择负责人"
                  treeNodeFilterProp="title"
                  treeData={treeOptions}
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item
                label="是否重点业务机会"
                name="is_importance"
                style={{ width: "80%" }}
              >
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="资金来源" name="capital_source">
                <Input placeholder="请输入资金来源" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="总投资金额" name="investment_amount">
                <MoneyInput />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="中标金额" name="win_bid_amount">
                <MoneyInput />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="机会价值" name="estimated_amount">
                <MoneyInput />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="挂网时间" name="hang_time">
                <DatePicker format="YYYY-MM-DD" allowClear style={{width:'100%'}} />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="开标时间" name="bid_open_time">
                <DatePicker
                  format="YYYY-MM-DD"
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="采购时间" name="purchase_date">
                <DatePicker
                  format="YYYY-MM-DD"
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="区域" name="area_id">
                <Select
                  options={area}
                  placeholder="请选择区域"
                  filterOption
                  showSearch
                  optionFilterProp="name"
                  fieldNames={{ label: "name", value: "id" }}
                />
              </Form.Item>
            </Col>
            <Col flex="100%">
              <Form.Item label="建设内容" name="build_content">
                <Input.TextArea
                  style={{ height: 200 }}
                  allowClear
                  placeholder="请输入建设内容"
                />
              </Form.Item>
            </Col>
            <Col flex="100%">
              <Form.Item label="备注" name="remark">
                <Input.TextArea
                  style={{ height: 200 }}
                  allowClear
                  placeholder="请输入备注"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
      <ChooseAddress.default ref={chooseAddressRef} />
    </PageWrapper>
  );
}

export default styled(Edit)`
  .title {
    display: flex;
    justify-content: space-between;
  }
`;
