import React from "react";
import { Button, Form, Input, Radio, Upload } from "antd";

import contextedModal from "src/framework/component/contexted-modal";
import qiniu from "src/util/qiniu";
import Icon from "src/framework/component/icon";
import uploadSvg from "src/assets/svg/upload.svg";
import { onPrgress } from "src/util/file/upload";
import { postFile } from "src/apps/admin/api/business-file";

type Result = {
  result: 1 | 2;
  remark: string;
  file_ids: FileResponse["id"][];
};

export default function () {
  return new Promise<Result>((resolve, reject) => {
    const value: Omit<Result, "file_ids"> & {
      files: FileResponse[];
    } = {
      result: 1,
      remark: "",
      files: [],
    };

    contextedModal.modal?.confirm({
      title: "审批",
      onCancel: () => reject(),
      onOk() {
        resolve({
          result: value.result,
          remark: value.remark,
          file_ids: value.files.map((i) => i.id),
        });
      },
      content: (
        <Form>
          <Form.Item label="审批">
            <Radio.Group
              defaultValue={value.result}
              onChange={(e) => {
                value.result = e.target.value;
              }}
            >
              <Radio value={1}>通过</Radio>
              <Radio value={2}>不通过</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Input.TextArea
              allowClear
              placeholder="请输入备注"
              onChange={(e) => (value.remark = e.target.value)}
            />
          </Form.Item>
          <Form.Item name="file_ids">
            <Upload<BaseResponse<FileResponse>>
              customRequest={function (option) {
                const file = option.file as File;
                const cancel = onPrgress(option.onProgress);
                qiniu
                  .upload(file)
                  .then((res) =>
                    postFile({
                      path: res.key,
                      name: file.name,
                      extend: {
                        file_size: file.size,
                        file_type: file.type,
                      },
                    })
                  )
                  .then(option.onSuccess)
                  .catch(option.onError)
                  .finally(cancel);
              }}
              onChange={async (e) => {
                if (e.file.status === "done") {
                  value.files = value.files.concat(e.file.response!.data);
                }
                if (e.file.status === "removed") {
                  value.files = value.files.filter(
                    (v) => v.id !== e.file.response!.data.id
                  );
                }
              }}
            >
              <Button icon={<Icon icon={uploadSvg} />}>添加附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      ),
    });
  });
}
