import {
    createDirectUploadTask,
  } from "qiniu-js";
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
      ).start();
    }
  }
  
  export default new QiniuYun();
  