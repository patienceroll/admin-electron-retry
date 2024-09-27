type Apps = "admin" | "framework";

type RoutePreload = {
  open: (
    path: string,
    options?: {
      app?: Apps;
      query?: Record<string, string>;
    }
  ) => void;
};
