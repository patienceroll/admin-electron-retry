type ViewsValue = {
  path: string;
  query?: Record<string, string | number>;
  view: Electron.WebContentsView;
  app: Apps;
};
