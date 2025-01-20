import styled, { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Card, Col, FloatButton, Form, Row } from "antd";
import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,  
  ProFormTextArea,
  ProFormTreeSelect,
} from "@ant-design/pro-form";
import dayjs from "dayjs";

import PageWrapper from "src/framework/component/page-wrapper";
function Edit(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as SalesOrder["id"];

  return <PageWrapper className={className}></PageWrapper>;
}

export default styled(Edit)``;
