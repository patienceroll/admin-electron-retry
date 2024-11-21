import { Form, Upload } from "antd";
import React from "react";
import { UploadRequestOption } from "rc-upload/lib/interface";

import { beforeUploadImage } from "src/util/file/validate";
import qiniu from "src/util/qiniu";
import { bindBusinessFile, postFile } from "src/apps/admin/api/business-file";
import { onPrgress } from "src/util/file/upload";

export default function (
  props: Pick<
    Parameters<typeof bindBusinessFile>[0],
    "service" | "identify"
  > & { tableId: string }
) {
  const { identify, service, tableId } = props;

  function cusUpload(
    params: Pick<Parameters<typeof bindBusinessFile>[0], "service" | "identify">
  ) {
    return function (option: UploadRequestOption<{ url: string }>) {
      const file = option.file as File;
      const cancel = onPrgress(option.onProgress);
      qiniu
        .uploadFile(file)
        .then((res) => {
          return postFile({
            path: res.key,
            name: res.hash,
            extend: {
              file_size: file.size,
              file_type: file.type,
            },
          });
        })
        .then((res) => {
          return new Promise<{ url: string }>((resolve, reject) => {
            bindBusinessFile({
              ...params,
              is_cover: 1,
              file_ids: [res.data.id],
              table_id: Number(tableId),
            })
              .then(() => {
                resolve({ url: res.data.full_path });
              })
              .catch(reject);
          });
        })
        .then(option.onSuccess)
        .catch(option.onError)
        .finally(cancel);
    };
  }

  return (
    <Form.Item
      name={identify}
      valuePropName="fileList"
      getValueFromEvent={(e) => e.fileList}
    >
      <Upload
        accept=".png,.jpg,.jpeg"
        listType="picture-card"
        beforeUpload={beforeUploadImage}
        onPreview={(file) => window.preload.viewImage(file.response!.url)}
        customRequest={cusUpload({
          service,
          identify,
        })}
      >
        上传
      </Upload>
    </Form.Item>
  );
}
