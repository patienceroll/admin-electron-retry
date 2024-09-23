import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";

import Layout from "src/framework/layout";

export default function () {
  return (
    <HashRouter>
      <Routes>
        <Route path="/layout" element={<Layout />} />
      </Routes>
    </HashRouter>
  );
}
