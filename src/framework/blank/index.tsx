import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageWrapper from "../component/page-wrapper";
import { MenuSlug } from "src/util/fetch";

export default function () {
  const navigate = useNavigate();

  useEffect(() => {
    window.preload.appMounted();
    return window.preload.onChangePath((path) => {
      MenuSlug.memoryRouterPath = path;
      navigate(path);
    });
  }, [navigate]);

  return <PageWrapper></PageWrapper>;
}
