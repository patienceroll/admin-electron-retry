declare module "*.png" {
  const value: string;
  export default value;
}

interface Window {
  preload: ThemePreload & LoginPreload & RoutePreload & WindowPreload;
}

type DisposeFunction = VoidFunction;
type StyledWrapComponents<T = unknown> = {
  className?: string;
} & T;
