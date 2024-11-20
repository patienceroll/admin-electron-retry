import { UploadProps } from "antd";

/** antd upload 的progress 模拟函数,用于产生动画 */
export function onPrgress(
  callback: Parameters<
    NonNullable<UploadProps["customRequest"]>
  >[0]["onProgress"]
) {
  if (!callback) return void 0;
  let progress = 0;
  let timer: number;

  function recusion() {
    timer = requestAnimationFrame(() => {
      progress += 1.6;
      if (progress <= 100) {
        callback!({
          percent: progress,
        });
        recusion();
      }
    });
  }

  recusion();

  return () => {
    cancelAnimationFrame(timer);
  };
}
