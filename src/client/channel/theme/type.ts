type Theme = {
  colorPrimary: string;
  /** 系统紧凑度 */
  layout: "normal" | "compact";
};

type ThemePreload = {
  readonly darkMode: boolean;
  getTheme: () => Theme;
  setTheme: (theme: Partial<Theme>) => void;
  onDarkModeChange: (callback: (dark: boolean) => void) => DisposeFunction;
  onThemeChange: (callback: (theme: Theme) => void) => DisposeFunction;
};
