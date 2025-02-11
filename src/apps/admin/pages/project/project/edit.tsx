import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styled, { useTheme } from "styled-components";
import {
  Col,
  FloatButton,
  Form,
  Input,
  Radio,
  Row,
  Card,
  DatePicker,
  TreeSelect,
  Descriptions,
} from "antd";
import dayjs from "dayjs";

import PageWrapper from "src/framework/component/page-wrapper";
import Title from "src/framework/component/title";
import AddressFormInput from "src/framework/component/address-form-input";
import { editProject, getProject } from "src/apps/admin/api/project";
import Icon from "src/framework/component/icon";
import SaveSvg from "src/assets/svg/保存.svg";
import { getProjectStatusText } from "src/apps/admin/api/business-opportunity";
import TextSelectInput from "src/framework/component/text-select-input";
import EditConcatList from "./components/edit-concat-list";
import useStaffTree from "src/b-hooks/use-staff-tree";
import BusinessFile from "src/b-components/business-file";

function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as Client["id"];

  const [detail, setDetail] = useState<ProjectDetail>();
  const [statusSelectList, setStatusSelectList] = useState<string[]>([]);
  const { options, treeOptions } = useStaffTree();
  const [form] = Form.useForm();
  const theme = useTheme();

  function getDetail() {
    getProject({ id }).then((res) => {
      setDetail(res.data);
      const {
        staff_id,
        province,
        city,
        county,
        latitude,
        longitude,
        address,
        hang_time,
        bid_open_time,
        purchase_date,
      } = res.data;

      form.setFieldsValue({
        ...res.data,
        staff_id: staff_id === 0 ? undefined : staff_id,
        hang_time: hang_time ? dayjs(hang_time) : null,
        bid_open_time: bid_open_time ? dayjs(bid_open_time) : null,
        purchase_date: purchase_date ? dayjs(purchase_date) : null,
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
        return editProject({
          id,
          ...store,
          hang_time: store.hang_time?.format("YYYY-MM-DD"),
          bid_open_time: store.bid_open_time?.format("YYYY-MM-DD"),
          purchase_date: store.purchase_date?.format("YYYY-MM-DD"),
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
    options.loadOption();
    getProjectStatusText().then((res) => {
      setStatusSelectList(res.data);
    });
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
              <Form.Item label="项目" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入项目" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="编号" name="code" rules={[{ required: true }]}>
                <Input placeholder="请输入编号" disabled />
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
              <Form.Item
                label="类别"
                name="category"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value="A">A</Radio>
                  <Radio value="B">B</Radio>
                  <Radio value="C">C</Radio>
                  <Radio value="D">D</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col flex="350px">
              <Form.Item label="行业" name="trade" rules={[{ required: true }]}>
                <TextSelectInput
                  options={["水利", "市政", "房建", "工业", "交通", "能源"]}
                  allowClear
                  placeholder="请选择行业"
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item
                label="项目状态"
                name="project_status"
                rules={[{ required: true }]}
              >
                <TextSelectInput
                  options={statusSelectList}
                  allowClear
                  placeholder="请选择项目状态"
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true }]}
              >
                <AddressFormInput placeholder="请输入项目地址" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item
                label="负责人"
                name="staff_id"
                rules={[{ required: true }]}
              >
                <TreeSelect
                  placeholder="请选择人员"
                  treeNodeFilterProp="title"
                  treeData={treeOptions}
                  multiple
                />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item
                label="是否重点项目"
                name="is_importance"
                style={{ width: "80%" }}
              >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item
                label="资金来源"
                name="capital_source"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入资金来源" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="总投资金额" name="investment_amount">
                <Input placeholder="请输入客户级别" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="中标金额" name="win_bid_amount">
                <Input placeholder="请输入客户级别" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="机会价值" name="estimated_amount">
                <Input placeholder="请输入客户级别" />
              </Form.Item>
            </Col>
            <Col flex="350px">
              <Form.Item label="挂网时间" name="hang_time">
                <DatePicker
                  format="YYYY-MM-DD"
                  allowClear
                  style={{ width: "100%" }}
                />
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
            <Col flex="700px">
              <Form.Item label="建设内容" name="build_content">
                <Input.TextArea allowClear placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col flex="700px">
              <Form.Item label="备注" name="remark">
                <Input.TextArea allowClear placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
      <Title style={{ marginTop: theme.margin }}>联系人</Title>
      <EditConcatList id={id} />

      <Title style={{ marginTop: theme.margin }}>相关信息</Title>

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
