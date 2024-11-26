type FilesPreload = {
  viewImage: (url: string) => Promise<void>;
  previewFile: (url: string) => Promise<void>
};
