import * as qiniu from "qiniu-js";
import dayjs from "dayjs";
import { UploadRequestOption } from "rc-upload/lib/interface";

import contextedNotify from "src/framework/component/contexted-notify";
import { getQiniuToken } from "src/apps/admin/api/qiniu-yun";
import { onPrgress } from "src/util/file/upload";
import { postFile } from "src/apps/admin/api/business-file";

class QiniuYun {
  tokenProvider() {
    return new Promise<string>((resolve, reject) => {
      return getQiniuToken()
        .then((res) => {
          resolve(res.data.token);
        })
        .catch(reject);
    });
  }
  async upload(file: File, key?: string) {
    const user = window.preload.getLocalUser();
    const currentTime = dayjs();
    const mergekey =
      key ||
      `${user ? `${user.name + user.id}` : "unknow-user"}/${currentTime.format(
        "YYYY-MM-DD"
      )}/${currentTime.valueOf()}/${file.name}`;
    const token = await this.tokenProvider();
    const observal = qiniu.upload(file, mergekey, token);

    return await new Promise<{
      hash: string;
      key: string;
    }>((resolve, reject) => {
      observal.subscribe({
        error(err) {
          if (
            err instanceof qiniu.QiniuNetworkError ||
            err instanceof qiniu.QiniuRequestError ||
            err instanceof qiniu.QiniuError
          ) {
            contextedNotify.notification?.error({
              message: "上传失败",
              description: err.message,
            });
          }
          reject(err);
        },
        complete: resolve,
      });
    });
  }
}

export default new QiniuYun();
