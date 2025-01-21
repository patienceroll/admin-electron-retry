import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageWrapper from "../component/page-wrapper";
import Permission from "src/util/permission";

export default function () {
  const navigate = useNavigate();

  useEffect(() => {
    window.preload.appMounted();
    return window.preload.onChangePath((path) => {
      Permission.memoryRouterPath = path;
      navigate(path);
    });
  }, [navigate]);

  return <PageWrapper></PageWrapper>;
}
