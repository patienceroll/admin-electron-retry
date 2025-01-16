import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import {
  Button,
  Card,
  Col,
  FloatButton,
  Row,
  Space,
  Tree,
  TreeDataNode,
} from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import { materialClassifyTree } from "src/apps/admin/api/marterial-classify";
import Icon from "src/framework/component/icon";
import AddSvg from "src/assets/svg/add.svg";
import FixAttrSet from "src/assets/svg/维护属性.svg";
import * as AttrSet from "./components/attr-set";
import * as ClassifyModify from "./components/classify-modify";

interface ClassifyItem extends TreeDataNode {
  _item: MaterialClassifyTree;
}

function Materail(props: StyledWrapComponents) {
  const { className } = props;
  const theme = useTheme();

  const [classify, setClassify] = useState<ClassifyItem[]>();

  const attrSet = AttrSet.createRef();
  const classifyModify = ClassifyModify.createRef();

  function getClassify() {
    materialClassifyTree().then((res) => {
      function recusion(item: MaterialClassifyTree): ClassifyItem {
        return {
          _item: item,
          key: item.id,
          selectable: false,
          checkable: false,
          title: () => (
            <Space>
              <span>{item.name}</span>
              <Button
                type="text"
                size="small"
                onClick={() => {
                  classifyModify.current?.edit(item).then(() => {
                    getClassify();
                  });
                }}
              >
                编辑
              </Button>
              <Button type="text" danger size="small">
                删除
              </Button>
            </Space>
          ),
          children: item.child ? item.child.map((c) => recusion(c)) : undefined,
        };
      }
      setClassify(res.data.map(recusion));
    });
  }

  useEffect(() => {
    getClassify();
  }, []);

  return (
    <PageWrapper className={className}>
      <Row gutter={theme.padding}>
        <Col flex="300px">
          <Card
            bordered
            className="classify"
            styles={{
              body: {
                overflowY: "auto",
              },
            }}
          >
            <Tree<ClassifyItem> showLine treeData={classify} />
          </Card>
        </Col>
        <Col flex={1}></Col>
      </Row>
      <FloatButton.Group shape="square">
        <FloatButton
          tooltip="新建分类"
          icon={<Icon icon={AddSvg} />}
          onClick={() => {
            classifyModify.current?.create().then(() => {
              getClassify();
            });
          }}
        />
        <FloatButton
          tooltip="维护属性"
          icon={<Icon icon={FixAttrSet} />}
          onClick={() => {
            attrSet.current?.set();
          }}
        />
      </FloatButton.Group>
      <AttrSet.default ref={attrSet} />
      <ClassifyModify.default ref={classifyModify} />
    </PageWrapper>
  );
}

export default styled(Materail)`
  .classify {
    height: calc(100vh - ${(props) => props.theme.padding * 2}px);
  }
`;
