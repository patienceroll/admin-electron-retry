import { Upload, UploadProps } from "antd";
import React from "react";

import contextedNotify from "src/framework/component/contexted-notify";
import {
  bindBusinessFile,
  deleteBusinessFile,
  postFile,
} from "src/apps/admin/api/business-file";
import { onPrgress } from "src/util/file/upload";
import qiniu from "src/util/qiniu";

type UploadResponse = { url: string; id: FileResponse["id"] };

export default function <Id extends string | number = number>(
  props: {
    id: Id;
    identify: BusinessFileIdentify;
    service: BusinessParams["service"];
    isCover: BusinessParams["is_cover"];
    files?: BusinessFile[];
  } & Pick<UploadProps, "maxCount">
) {
  const { id, files, identify, service, isCover, maxCount } = props;
  return (
    <Upload<UploadResponse>
      maxCount={maxCount}
      listType="picture-card"
      defaultFileList={files?.map((item) => ({
        uid: String(item.file_id),
        url: item.path,
        name: item.name,
        fileName: item.name,
        thumbUrl: item.full_path,
        status: "done",
        response: {
          url: item.full_path,
          id: item.file_id,
        },
      }))}
      showUploadList={{
        showDownloadIcon: (file) => file.status === "done",
        showPreviewIcon: (file) => file.status === "done",
        showRemoveIcon: (file) => file.status === "done",
      }}
      onPreview={(file) =>
        window.preload.previewFile(file.response!.url).catch((err) => {
          contextedNotify.notification?.error({
            message: "文件预览失败",
            description: err.message,
          });
        })
      }
      onDownload={(file) => {
        window.preload.downloadFile(file.response!.url).catch((err) => {
          contextedNotify.notification?.error({
            message: "文件下载失败",
            description: err.message,
          });
        });
      }}
      onRemove={(file) => {
        return new Promise<boolean>((resolve, reject) => {
          deleteBusinessFile({ file_id: file!.response!.id })
            .then(() => resolve(true))
            .catch(reject);
        });
      }}
      customRequest={function (option) {
        const file = option.file as File;
        const cancel = onPrgress(option.onProgress);
        qiniu
          .upload(file)
          .then((res) => {
            return postFile({
              path: res.key,
              name: file.name,
              extend: {
                file_size: file.size,
                file_type: file.type,
              },
            });
          })
          .then((res) => {
            return new Promise<UploadResponse>((resolve, reject) => {
              bindBusinessFile({
                service,
                identify,
                is_cover: isCover,
                file_ids: [res.data.id],
                table_id: id,
              })
                .then((file) => {
                  resolve({ url: res.data.full_path, id: file.data.id });
                })
                .catch(reject);
            });
          })
          .then(option.onSuccess)
          .catch(option.onError)
          .finally(cancel);
      }}
    >
      上传
    </Upload>
  );
}
