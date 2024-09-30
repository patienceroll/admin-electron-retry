type Apps = "admin" | "framework";

type GetRouteItem = Pick<ViewsValue, "app" | "path" | "query" | "name">;

type RoutePreload = {
  open: (
    path: string,
    name: string,
    options?: {
      app?: Apps;
      query?: Record<string, string>;
    }
  ) => void;
  getRoutes: () => {
    current: ViewsValue["path"];
    routes: GetRouteItem[];
  };
};
