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
