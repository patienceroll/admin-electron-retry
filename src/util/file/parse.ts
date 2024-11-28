/** 解析url */
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
    filename: filename,
    extension: extension,
  };
}
