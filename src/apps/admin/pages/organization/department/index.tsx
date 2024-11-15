import { ProFormText, QueryFilter } from "@ant-design/pro-components";
import React from "react";
import styled from "styled-components";

import PageWrapper from "src/framework/component/page-wrapper";
import { Card } from "antd";

function Department() {
  return (
    <PageWrapper>
      <Card bordered>
        <QueryFilter defaultCollapsed split>
          <ProFormText name="name" label="应用名称" />
        </QueryFilter>
      </Card>
    </PageWrapper>
  );
}

export default styled(Department)``;
