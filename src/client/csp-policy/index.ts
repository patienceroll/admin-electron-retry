type CSPPolicy = {
  defaultSrc?: string | string[];
  scriptSrc?: string | string[];
  styleSrc?: string | string[];
  imgSrc?: string | string[];
  fontSrc?: string | string[];
  mediaSrc?: string | string[];
  objectSrc?: string | string[];
  frameSrc?: string | string[];
  childSrc?: string | string[];
  connectSrc?: string | string[];
  workerSrc?: string | string[];
  // 可以继续添加其他指令
};

export default function buildCSP(policy: CSPPolicy): string {
  const directives: string[] = [];

  for (const [directive, value] of Object.entries(policy)) {
    if (value !== undefined) {
      // 将指令名称转换为正确的格式（小写并使用连字符）
      const formattedDirective = directive
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase();
      directives.push(
        `${formattedDirective} ${
          Array.isArray(value) ? value.join(" ") : value
        };`
      );
    }
  }

  return directives.join(" ");
}
