import styled, { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Form, Row } from "antd";
import { ProFormTreeSelect } from "@ant-design/pro-components";

import PageWrapper from "src/framework/component/page-wrapper";
import Title from "src/framework/component/title";
import { getDepartmentTree } from "src/apps/admin/api/department";

function Create() {
  const theme = useTheme();
  const [form] = Form.useForm();

  const [deparmentTree, setDeparmentTree] = useState<DepartmentTreeItem[]>([]);

  function getTree() {
    getDepartmentTree().then((res) => {
      setDeparmentTree(res.data);
    });
  }

  useEffect(() => {
    getTree();
  }, []);

  return (
    <PageWrapper>
      <Form form={form} labelCol={{ span: 4 }}>
        <Title>基本信息</Title>
        <Row
          style={{ margin: theme.margin }}
          gutter={[theme.padding, theme.padding]}
        >
          <Col flex="300px">
            <ProFormTreeSelect
              label="部门"
              name="department_id"
              placeholder="请选择所属部门"
              fieldProps={{
                treeData: deparmentTree,
                showSearch: true,
                treeNodeFilterProp:'name',
                fieldNames: {
                  children: "child",
                  label: "name",
                  value: "id",
                },
              }}
            />
          </Col>
        </Row>
      </Form>

      {/* <Button
        onClick={function () {
          window.parent.postMessage("success");
          window.close()
        }}
      >完成编辑</Button> */}
    </PageWrapper>
  );
}

export default styled(Create)``;
