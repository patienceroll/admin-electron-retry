import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageWrapper from "../component/page-wrapper";

export default function () {
  const navigate = useNavigate();

  useEffect(() => {
    window.preload.appMounted()
    return window.preload.onChangePath(navigate);
  }, [navigate]);

  return <PageWrapper></PageWrapper>;
}
