type WindowPreload = {
  onMaximize: (callback: VoidFunction) => DisposeFunction;
  onMinimize: (callback: VoidFunction) => DisposeFunction;
  onUnmaximize: (callback: VoidFunction) => DisposeFunction;
  isMaximize: () => boolean;
  minimize: VoidFunction;
  maximize: VoidFunction;
  unmaximize: VoidFunction;
  close: VoidFunction
};
