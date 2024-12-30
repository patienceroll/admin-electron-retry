import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router";

import PageWrapper from "src/framework/component/page-wrapper";
import { getProject } from "src/apps/admin/api/project";

function Detail(props: StyledWrapComponents) {
  const { className } = props;
  const params = useLocation();
  const search = new URLSearchParams(params.search);
  const id = search.get("id")! as unknown as Project["id"];

  const [detail, setDetail] = useState<ProjectDetail>();

  const getDetail = useCallback(
    function () {
      getProject({ id }).then((res) => {
        setDetail(res.data);
      });
    },
    [id]
  );

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return <PageWrapper className={className}></PageWrapper>;
}

export default styled(Detail)``;
