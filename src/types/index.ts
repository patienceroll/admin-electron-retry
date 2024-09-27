declare module "*.png" {
  const value: string;
  export default value;
}

interface Window {
  preload: ThemePreload & RoutePreload;
}

type DisposeFunction = VoidFunction;
type StyledWrapComponents<T = unknown> = {
  className?: string;
} & T;
