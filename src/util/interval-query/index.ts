
/** 轮训condition是否true */
export default function (options: {
  condition: () => boolean;
  onSuccess?: VoidFunction;
  onError?: (err: Error) => void;
  /** 查询时间, 以秒为单位，默认2秒 */
  times?: number;
}) {
  const { condition, onSuccess, onError, times: totalTime = 2 } = options;

  let animate = NaN;
  let times = 0;
  function query() {
    times += 1;
    if (condition()) {
      cancelAnimationFrame(animate);
      onSuccess?.();
    } else if (times >= (totalTime * 1000) / 16) {
      cancelAnimationFrame(animate);
      onError?.(new Error("out of time."));
    } else {
      animate = requestAnimationFrame(query);
    }
  }
  requestAnimationFrame(query);
}
