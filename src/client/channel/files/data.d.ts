type FilesPreload = {
  previewFile: (url: string) => Promise<void>;
  downloadFile: (url: string) => Promise<void>;
  printFile: (url: string) => Promise<void>;
};
