/** 解析url
 * filename 是包含后缀的,请注意
 */
export function parseUrlFile(url: string) {
  // 使用 URL 构造函数解析 URL
  const parsedUrl = new URL(url);

  // 获取路径名
  const pathname = parsedUrl.pathname;

  // 获取文件名
  const filename = pathname.split("/").pop();
  // 检查是否有文件名和后缀
  if (!filename || filename.lastIndexOf(".") === -1) {
    throw new Error("Invalid URL: No filename or extension found.");
  }

  // 获取文件后缀
  const dotIndex = filename.lastIndexOf(".");
  const extension = dotIndex !== -1 ? filename.substring(dotIndex + 1) : "";

  return {
    filename: decodeURIComponent(filename),
    extension: extension,
  };
}

/** 解析文件大小为  Bytes", "KB", "MB", "GB", "TB" */
export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
