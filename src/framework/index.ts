import { createElement } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

const root = createRoot(document.getElementById("root") as HTMLDivElement);

root.render(createElement(App));
