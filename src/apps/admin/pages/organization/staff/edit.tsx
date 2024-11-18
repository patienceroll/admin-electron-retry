import styled, { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Space, Spin } from "antd";
import {
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

import PageWrapper from "src/framework/component/page-wrapper";
import Title from "src/framework/component/title";
import { getDepartmentTree } from "src/apps/admin/api/department";
import useOption from "src/hooks/use-option";
import { getJobOptions } from "src/apps/admin/api/job";
import useWather from "src/hooks/use-wather";
import { editStaff, getStaffDetail } from "src/apps/admin/api/staff";

function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const [search] = useSearchParams(location.hash);
  const id = search.get("id")!;
  const theme = useTheme();
  const [form] = Form.useForm();

  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);
  const [detail, setDetail] = useState<StaffListItem>();

  const [loading] = useWather();
  const [job] = useOption(getJobOptions);

  function getTree() {
    getDepartmentTree().then((res) => {
      setDeparmentTree(res.data);
    });
  }

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return editStaff({
          ...store,
          id: detail!.id,
          entry_time: store.entry_time
            ? store.entry_time.format("YYYY-MM-DD")
            : undefined,
          inner_time: store.inner_time
            ? store.inner_time.format("YYYY-MM-DD")
            : undefined,
        });
      })
      .then(() => {
        window.parent.postMessage("success");
        window.close();
      })
      .finally(loading.setFalse);
  }

  useEffect(() => {
    getTree();
  }, []);

  useEffect(() => {
    getStaffDetail({ id: Number(id!) }).then((res) => {
      const item = res.data;
      if (item.department_id) {
        job.params.department_id = item.department_id;
        job.loadOption();
      }
      form.setFieldsValue({
        ...item,
        entry_time: item.entry_time ? dayjs(item.entry_time) : undefined,
        inner_time: item.inner_time ? dayjs(item.inner_time) : undefined,
      });
      setDetail(res.data);
    });
  }, [form, id, job]);

  return (
    <Spin spinning={detail === undefined}>
      <PageWrapper className={className}>
        <Form form={form} labelCol={{ span: 6 }}>
          <Title>基本信息</Title>
          <Row
            style={{ margin: theme.margin }}
            gutter={[theme.padding, theme.padding]}
          >
            <Col flex="400px">
              <ProFormTreeSelect
                label="部门"
                name="department_id"
                placeholder="请选择所属部门"
                rules={[{ required: true, message: "请选择部门" }]}
                fieldProps={{
                  treeData: deparmentTree,
                  showSearch: true,
                  treeNodeFilterProp: "name",
                  fieldNames: {
                    children: "child",
                    label: "name",
                    value: "id",
                  },
                  onChange(e) {
                    form.setFieldValue("job_id", undefined);
                    job.params.department_id = e;
                    job.loadOption();
                  },
                }}
              />
            </Col>
            <Col flex="400px">
              <ProFormSelect<JobListItem>
                name="job_id"
                label="职位"
                rules={[{ required: true, message: "请选择职位" }]}
                options={job.list}
                fieldProps={{
                  optionFilterProp: "name",
                  fieldNames: { label: "name", value: "id" },
                  showSearch: true,
                }}
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="name"
                label="姓名"
                placeholder="请输入姓名"
                rules={[{ required: true, message: "请输入姓名" }]}
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="code"
                label="工号"
                placeholder="请输入工号"
                rules={[{ required: true, message: "请输入工号" }]}
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="phone"
                label="手机号"
                placeholder="请输入手机号"
                rules={[
                  { required: true, message: "请输入手机号" },
                  {
                    message: "手机号有误",
                    pattern: /^1[3486789]\d{9}$/,
                  },
                ]}
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="ID_card"
                label="身份证"
                placeholder="请输入身份证号"
                rules={[
                  { required: true, message: "请输入身份证号" },
                  {
                    message: "身份证有误",
                    pattern:
                      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                  },
                ]}
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="wechat"
                label="微信"
                placeholder="请输入微信号"
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="family_address"
                label="籍贯"
                placeholder="请输入籍贯"
              />
            </Col>
            <Col flex="400px">
              <ProFormDatePicker
                name="entry_time"
                label="入职日期"
                placeholder="请选择入职日期"
                fieldProps={{ style: { width: "100%" } }}
              />
            </Col>
            <Col flex="400px">
              <ProFormDatePicker
                name="inner_time"
                label="转正日期"
                placeholder="请选择转正日期"
                fieldProps={{ style: { width: "100%" } }}
              />
            </Col>
            <Col flex="400px">
              <ProFormTextArea
                name="current_address"
                label="居住地址"
                placeholder="请输入当前居住地址"
              />
            </Col>
          </Row>

          <Title style={{ marginTop: theme.margin }}>状态信息</Title>
          <Row
            style={{ margin: theme.margin }}
            gutter={[theme.padding, theme.padding]}
          >
            <Col flex="400px">
              <ProFormRadio.Group
                name="is_staff"
                label="是否职员"
                options={[
                  { label: "职员", value: 1 },
                  { label: "非职员", value: 0 },
                ]}
              />
            </Col>
            <Col flex="400px">
              <ProFormRadio.Group
                name="status"
                label="在职状态"
                options={[
                  { label: "转正", value: 2 },
                  { label: "试用", value: 1 },
                  { label: "离职", value: 0 },
                ]}
              />
            </Col>
            <Col flex="400px">
              <ProFormRadio.Group
                name="is_married"
                label="婚姻状态"
                options={[
                  { label: "未婚", value: 0 },
                  { label: "已婚", value: 1 },
                  { label: "已婚已孕", value: 2 },
                  { label: "离异", value: 3 },
                ]}
              />
            </Col>
          </Row>

          <Title>学历信息</Title>
          <Row
            style={{ margin: theme.margin }}
            gutter={[theme.padding, theme.padding]}
          >
            <Col flex="400px">
              <ProFormSelect
                name="educational"
                label="学历"
                placeholder="请选择学历"
                options={[
                  "小学",
                  "初中",
                  "高中",
                  "职高",
                  "大专",
                  "大专（非全日制）",
                  "本科",
                  "本科（非全日制）",
                  "硕士",
                  "博士",
                ].map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="school"
                label="毕业院校"
                placeholder="请输入毕业院校"
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="profession"
                label="专业"
                placeholder="请输入专业"
              />
            </Col>
            <Col flex="400px">
              <ProFormText
                name="position_title"
                label="职称"
                placeholder="请输入职称"
              />
            </Col>
          </Row>
        </Form>
        <div className="submit">
          <Space>
            <Button
              type="default"
              onClick={() => {
                window.close();
              }}
            >
              返回
            </Button>
            <Button type="primary" onClick={submit} loading={loading.whether}>
              保存
            </Button>
          </Space>
        </div>
      </PageWrapper>
    </Spin>
  );
}

export default styled(Edit)`
  .submit {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
