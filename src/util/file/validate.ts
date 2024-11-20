import Upload, { RcFile } from "antd/es/upload";

import contextedMessage from "src/framework/component/contexted-message";

/** antd uploadimage的通用图片配置 */
export function beforeUploadImage(file: RcFile) {
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    contextedMessage.message?.error("请上传png,jpg,jpeg格式的图片");
    return Upload.LIST_IGNORE;
  }
  return Promise.resolve(file);
}

