import type { CSSProp } from "styled-components";
import { GlobalToken } from "antd";

declare module "styled-components" {
  export interface DefaultTheme extends GlobalToken {}
}
