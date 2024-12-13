import React, { useEffect, useState } from "react";
import { useLocation } from "react-router/dist";
import PageWrapper from "src/framework/component/page-wrapper";
import styled from "styled-components";
import { getClient } from "src/apps/admin/api/client";
import Title from "src/framework/component/title";

function Detail() {
    const params = useLocation()
    const search = new URLSearchParams(params.search)
    const id = search.get('id')!

    const [detail, setDetail] = useState<ClientListItem>()


    function getDetail() {
        getClient(({ id: Number(id) })).then(res => {
            setDetail(res.data)
        })
    }

    useEffect(() => {
        getDetail()
    }, [])

    return <PageWrapper>
        <Title>基本信息</Title>
    </PageWrapper>
}

export default styled(Detail)``;
