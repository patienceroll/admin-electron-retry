import Decimal from "decimal.js";
import nzhcn from "nzh";

export default class Money {
  current: string;
  constructor(value: string | number) {
    this.current = String(value);
  }

  /** 转换为人名币格式
   * - showSymbol 默认 true
   * - showSymbol = true  10000000 --> ¥100,000,000.00
   * - showSymbol = false 10000000 --> 100,000,000.00
   */
   toCNY(
    options: {
      showSymbol: boolean;
    } = {
      showSymbol: true,
    }
  ) {
    const { showSymbol } = options;
    const text = Number(this.current).toLocaleString("zh-CN", {
      style: "currency",
      currency: "CNY",
    });
    if (showSymbol) return text;
    return text.replace("¥", "");
  }

  /** 转换为人名币大写 */
  get toUpcaseCNY() {
    return nzhcn.cn.toMoney(this.current);
  }

  /** 转换为 xx.xx 万,保留两位小数
   * - 111101 --> 11.11
   */
  get toTenThousand() {
    const value = Math.abs(Number(this.current));
    const isAbs = Number(this.current) >= 0;
    const tenThousand = Math.floor(value / 10000);
    const reduce = new Decimal(value).mod(10000).div(10000).toFixed(2);
    if (isAbs) return new Decimal(tenThousand).add(reduce).toNumber();
    return -new Decimal(tenThousand).add(reduce).toNumber();
  }

  /** 先转换为万,然后转换为 三位数的分割 */
  get toTenThousandCNY() {
    return new Money(this.toTenThousand).toCNY();
  }
}
