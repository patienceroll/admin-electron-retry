import { Modal } from "antd";
import React, { forwardRef } from "react";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";

const Permission = forwardRef(function () {
  const [open] = useWather();

  return <Modal></Modal>;
});

export default styled(Permission)``;
