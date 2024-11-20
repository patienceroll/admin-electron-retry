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
  // 可以继续添加其他指令
};

export default function buildCSP(policy: CSPPolicy): string {
  const directives: string[] = [];

  for (const [directive, value] of Object.entries(policy)) {
    if (value !== undefined) {
      directives.push(
        `${directive} ${Array.isArray(value) ? value.join(" ") : value};`
      );
    }
  }

  return directives.join(" ");
}
