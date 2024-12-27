import { Upload } from "antd";
import React from "react";

import contextedNotify from "src/framework/component/contexted-notify";
import { bindBusinessFile, postFile } from "src/apps/admin/api/business-file";
import { onPrgress } from "src/util/file/upload";
import qiniu from "src/util/qiniu";

export default function (props: {
  id: Project["id"];
  identify: BusinessFileIdentify, 
  files: ProjectDetail["file"][keyof ProjectDetail["file"]];
}) {
  const { id, files } = props;
  return (
    <Upload
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
        },
      }))}
      showUploadList={{
        showDownloadIcon: (file) => file.status === "done",
        showPreviewIcon: (file) => file.status === "done",
        showRemoveIcon: () => false,
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
      customRequest={function (option) {
        const file = option.file as File;
        const cancel = onPrgress(option.onProgress);
        qiniu
          .upload(file)
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
                service: "business-opportunity",
                identify: "业务机会附件",
                is_cover: 1,
                file_ids: [res.data.id],
                table_id: id,
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
      }}
    >
      上传
    </Upload>
  );
}
