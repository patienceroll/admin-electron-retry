import { createDirectUploadTask } from "qiniu-js";
import {
  CanceledResult,
  ErrorResult,
  SuccessResult,
} from "qiniu-js/output/@internal";
import { TokenProvider } from "qiniu-js/output/@internal/types/token";

import { getQiniuToken } from "src/apps/admin/api/qiniu-yun";

class QiniuYun {
  tokenProvider: TokenProvider = () =>
    new Promise<string>((resolve, reject) => {
      return getQiniuToken()
        .then((res) => {
          resolve(res.data.token);
        })
        .catch(reject);
    });

  /** 上传相对比较小的文件,可以不关注进度 */
  uploadFile(file: File) {
    return createDirectUploadTask(
      { type: "file", data: file },
      {
        tokenProvider: this.tokenProvider,
      }
    )
      .start()
      .then((res) => {
        if ((res as SuccessResult<string>).result) {
          return JSON.parse((res as SuccessResult<string>).result) as {
            hash: string;
            key: string;
          };
        }
        if ((res as CanceledResult).canceled) {
          return Promise.reject("已取消");
        }
        if ((res as ErrorResult).error) {
          return Promise.reject((res as ErrorResult).error);
        }
        return Promise.reject("unkonw-error");
      });
  }
}

export default new QiniuYun();
