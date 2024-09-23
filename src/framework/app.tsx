import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "src/framework/layout";

export default function () {
  return (
    <Routes>
      <Route path="/layout" element={<Layout />} />
    </Routes>
  );
}
