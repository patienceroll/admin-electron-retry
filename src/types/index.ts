declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  import { ComponentType, SVGProps } from "react";

  const content: ComponentType<SVGProps<SVGSVGElement>>;
  export default content;
}

interface Window {
  preload: LocalPreload &
    ThemePreload &
    LoginPreload &
    RoutePreload &
    WindowPreload;
}

type DisposeFunction = VoidFunction;
type StyledWrapComponents<T = unknown> = {
  className?: string;
} & T;

type ListParam<T = {}> = {
  page: number;
  pageSize: number;
} & T;

type List<T> = {
  list: T[];
  pageInfo: {
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
};


type OptionParams<T> = {
  page: -1;
} & T;