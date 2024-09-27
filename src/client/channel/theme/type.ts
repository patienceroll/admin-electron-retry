type Theme = {
  colorPrimary: string;
};

type ThemePreload = {
  readonly darkMode: boolean;
  getTheme: () => Theme;
  setTheme: (theme: Partial<Theme>) => void;
  onDarkModeChange: (callback: (dark: boolean) => void) => DisposeFunction;
};
