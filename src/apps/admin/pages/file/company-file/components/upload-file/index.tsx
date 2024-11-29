import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Upload } from "antd";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import useWather from "src/hooks/use-wather";
import styled from "styled-components";

import { postFile } from "src/apps/admin/api/business-file";
import { onPrgress } from "src/util/file/upload";
import qiniu from "src/util/qiniu";

type SomeType = {
  file_dir_id: Folder["id"];
};

type Props = {};

type Ref = {
  upload: (item: SomeType) => Promise<void>;
};

export function createRef() {
  return useRef<Ref>(null);
}

const Component = forwardRef<Ref, Props>(function (props, ref) {
  const [open] = useWather();
  const [loading] = useWather();

  const [form] = Form.useForm();

  const config = useRef<{
    resolve: () => void;
    reject: (reason?: any) => void;
    title: string;
    item: SomeType;
  }>({
    reject() {},
    resolve() {},
    title: "",
    item: { file_dir_id: 0 },
  });

  function submit() {
    form
      .validateFields()
      .then((store) => {
        loading.setTrue();
        return postFile({
          file_dir_id: config.current.item.file_dir_id,
          path: store.file[0].response.path,
          name: store.file[0].name,
          extend: {
            file_size: store.file[0].size,
            file_type: store.file[0].type,
          },
        });
      })
      .then(() => {
        config.current.resolve();
        open.setFalse();
        loading.setFalse();
      })
      .catch(() => {
        loading.setFalse();
      });
  }

  useImperativeHandle(ref, () => ({
    upload(item) {
      return new Promise((resolve, reject) => {
        config.current = {
          reject,
          resolve,
          title: "上传文件到当前目录",
          item: item,
        };
        open.setTrue();
        form.setFieldsValue(item);
      });
    },
  }));

  function onClose() {
    open.setFalse();
  }

  return (
    <Modal
      title={config.current.title}
      open={open.whether}
      maskClosable={!loading.whether}
      closeIcon={loading.whether}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose} disabled={loading.whether}>
            关闭
          </Button>
          <Button type="primary" loading={loading.whether} onClick={submit}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item
          name="file"
          rules={[{ required: true, message: "请上传文件" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload.Dragger
            maxCount={1}
            customRequest={function (option) {
              const file = option.file as File;
              const cancel = onPrgress(option.onProgress);
              qiniu
                .upload(file)
                .then((res) => {
                  option.onSuccess?.({
                    path: res.key,
                    name: file.name,
                    extend: {
                      file_size: file.size,
                      file_type: file.type,
                    },
                  });
                })
                .catch(option.onError)
                .finally(cancel);
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default styled(Component)``;
