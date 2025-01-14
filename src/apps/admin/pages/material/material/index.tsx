import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Button, Card, Col, Row, Space, Tree, TreeDataNode } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import { materialClassifyTree } from "src/apps/admin/api/marterial-classify";

interface ClassifyItem extends TreeDataNode {
  _item: MaterialClassifyTree;
}

function Materail(props: StyledWrapComponents) {
  const { className } = props;
  const theme = useTheme();

  const [classify, setClassify] = useState<ClassifyItem[]>();

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
              <Button type="text" size="small">
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
          <Card bordered className="classify">
            <Tree<ClassifyItem> showLine treeData={classify} />
          </Card>
        </Col>
        <Col flex={1}></Col>
      </Row>
    </PageWrapper>
  );
}

export default styled(Materail)`
  .classify {
    height: calc(100vh - ${(props) => props.theme.padding * 2}px);
  }
`;
