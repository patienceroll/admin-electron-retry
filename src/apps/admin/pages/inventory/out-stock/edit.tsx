import { Form } from "antd";
import React,{ useState } from "react";
import {  useLocation } from "react-router-dom";
import styled, { useTheme } from "styled-components";

import PageWrapper from "src/framework/component/page-wrapper";

function Edit(props: StyledWrapComponents) {
    const { className } = props;
    const params = useLocation();
    const search = new URLSearchParams(params.search);
    const id = search.get("id")! as unknown as SalesOrder["id"];
    const theme = useTheme();
    const [detail, setDetail] = useState<SalesOrder>();
    const [form] = Form.useForm();

    return  <PageWrapper className={className}>
        编辑出库单详情
    </PageWrapper>
}

export default styled(Edit)``