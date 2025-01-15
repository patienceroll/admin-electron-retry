import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Col, Modal, Row } from "antd";
import styled, { useTheme } from "styled-components";
import ProTable from "@ant-design/pro-table";

import useWather from "src/hooks/use-wather";

type Ref = {
  set: () => void;
};

export function createRef() {
  return useRef<Ref>(null);
}

const AttrSet = forwardRef<Ref, StyledWrapComponents>(function (props, ref) {
  const { className } = props;

  const [open] = useWather();
  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    set() {
      open.setTrue();
    },
  }));

  return (
    <Modal
      title="属性维护"
      className={className}
      open={open.whether}
      footer={null}
      onCancel={open.setFalse}
      width={600}
    >
      <Row gutter={theme.padding}>
        <Col flex={1}>
          <ProTable
            columns={[{}]}
            search={false}
            pagination={false}
            options={false}
          />
        </Col>
        <Col></Col>
      </Row>
    </Modal>
  );
});

export default styled(AttrSet)``;
