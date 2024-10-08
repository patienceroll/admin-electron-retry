type Apps = "admin" | "framework";

type GetRouteItem = Pick<ViewsValue, "app" | "path" | "query" | "name">;

type GetRoutes = {
  current: ViewsValue["path"];
  routes: GetRouteItem[];
};

type RoutePreload = {
  open: (
    path: string,
    name: string,
    options?: {
      app?: Apps;
      query?: Record<string, string>;
    }
  ) => void;
  close: (path: string) => void;
  getRoutes: () => GetRoutes;
  onRoutesChange: (callback: (routes: GetRoutes) => void) => DisposeFunction;
};
