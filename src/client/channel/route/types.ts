type Apps = "admin" | "framework";

type GetRouteItem = Pick<ViewsValue, "app" | "path" | "query" | "name">;

type GetRoutes = {
  current: ViewsValue["path"];
  routes: GetRouteItem[];
};

type RoutePreload = {
  /** 打开一个新页面 */
  open: (
    path: string,
    name: string,
    options?: {
      app?: Apps;
      query?: Record<string, string>;
    }
  ) => void;
  /** 关闭一个tab菜单(路由) */
  close: (path: string) => void;
  getRoutes: () => GetRoutes;
  onRoutesChange: (callback: (routes: GetRoutes) => void) => DisposeFunction;
};
