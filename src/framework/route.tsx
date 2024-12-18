import { Route, BrowserRouter, MemoryRouter, Routes } from "react-router-dom";
import React, { useState } from "react";

import Layout from "src/framework/layout";
import Login from "./login";
import Menu from "./menu";
import Page404 from "./404";
import Blank from "./blank";

export default function (props: { darkMode: boolean }) {
  const { darkMode } = props;
  const [isPackaged] = useState(() => window.preload.isPackaged);
  const routes = (
    <Routes>
      <Route path="/" element={<Blank />} />
      <Route path="/layout" element={<Layout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={<Menu darkMode={darkMode} />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );

  return isPackaged ? (
    <MemoryRouter initialEntries={["/"]}>{routes}</MemoryRouter>
  ) : (
    <BrowserRouter basename="/framework">{routes}</BrowserRouter>
  );
}
