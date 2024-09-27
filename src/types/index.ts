declare module "*.png" {
  const value: string;
  export default value;
}

interface Window {
  preload: ThemePreload;
}

type DisposeFunction = VoidFunction;
type StyledWrapComponents<T = unknown> = {
  className: string;
} & T;
