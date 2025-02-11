import styled, { useTheme } from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import {
  Affix,
  Breadcrumb,
  Button,
  Col,
  FloatButton,
  List,
  Row,
  Segmented,
} from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import {
  deleteFile,
  deleteFolder,
  getFolder,
} from "src/apps/admin/api/business-file";
import useWather from "src/hooks/use-wather";
import FolderSvg from "src/assets/svg/文件夹.svg";
import Icon from "src/framework/component/icon";
import FileSvg from "src/assets/svg/文件.svg";
import FolderItem from "src/apps/admin/pages/file/company-file/components/folder-item";
import FileItem from "src/apps/admin/pages/file/company-file/components/file-item";
import contextedNotify from "src/framework/component/contexted-notify";
import Title from "src/framework/component/title";
import AddSvg from "src/assets/svg/add.svg";
import UploadSvg from "src/assets/svg/upload.svg";
import * as EditFolder from "./components/edit-folder";
import contextedMessage from "src/framework/component/contexted-message";
import * as UploadFile from "./components/upload-file";
import contextedModal from "src/framework/component/contexted-modal";

function BusinessFile(props: StyledWrapComponents) {
  const { className } = props;
  const [loading] = useWather();
  const theme = useTheme();

  const ref = EditFolder.createRef();
  const uploadRef = UploadFile.createRef();

  const [listType, sertListType] = useState<"row" | "item">("item");
  const [folder, setFolder] = useState<FolderListItem>({
    parent_dir: [],
    list: [],
  });

  const getFolderBy = useCallback(
    function (params: Partial<Parameters<typeof getFolder>[0]> = {}) {
      if (loading.whether) return Promise.reject();
      loading.setTrue();
      return getFolder({ pid: 0, type: 1, ...params })
        .then((res) => {
          setFolder(res.data);
        })
        .finally(loading.setFalse);
    },
    [loading]
  );

  function reload() {
    getFolderBy({ pid: folder.current_dir?.id || 0 });
  }

  useEffect(() => {
    getFolderBy();
  }, [getFolderBy]);

  return (
    <PageWrapper className={className}>
      <Affix offsetTop={theme.padding}>
        <div className="top">
          <Title style={{ flex: 1 }}>
            <Breadcrumb
              style={{ lineHeight: "38px" }}
              items={[
                {
                  title: "根目录",
                  className: "bread",
                  onClick() {
                    getFolderBy();
                  },
                },
                ...folder.parent_dir.map((item) => ({
                  title: item.name,
                  className: "bread",
                  onClick() {
                    getFolderBy({ pid: item.id });
                  },
                })),
              ]}
            />
          </Title>
          <div className="action">
            <Segmented
              style={{ flexShrink: 0 }}
              value={listType}
              options={[
                {
                  value: "row",
                  label: "列表",
                },
                {
                  value: "item",
                  label: "图标",
                },
              ]}
              onChange={sertListType}
            />
          </div>
        </div>
      </Affix>
      {listType === "row" && folder.list.length !== 0 && (
        <List
          dataSource={folder.list}
          renderItem={(item) => (
            <List.Item
              className="item"
              onClick={() => getFolderBy({ pid: item.id })}
              actions={[
                <Button
                  type="text"
                  onClick={function (event) {
                    event.stopPropagation();
                    ref.current?.edit(item).then(reload);
                  }}
                >
                  编辑
                </Button>,
                <Button
                  type="text"
                  danger
                  onClick={function (event) {
                    event.stopPropagation();
                    contextedModal.modal?.confirm({
                      title: "删除",
                      content: `确定删除文件夹 ${item.name}?`,
                      onOk() {
                        return deleteFolder({ id: item.id }).then(() => {
                          contextedMessage.message?.success("成功删除");
                          reload();
                        });
                      },
                    });
                  }}
                >
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                avatar={<Icon icon={FolderSvg} />}
                description={`${item.created_user?.name} ${item.created_at}`}
              />
            </List.Item>
          )}
        />
      )}
      {listType === "row" &&
        folder.current_dir &&
        folder.current_dir.file.length !== 0 && (
          <List
            locale={{ emptyText: null }}
            dataSource={folder.current_dir.file}
            renderItem={(item) => (
              <List.Item
                className="item"
                onClick={function () {
                  window.preload.previewFile(item.full_path).catch((err) => {
                    contextedNotify.notification?.error({
                      message: "文件预览失败",
                      description: err.message,
                    });
                  });
                }}
                actions={[
                  <Button
                    type="text"
                    danger
                    onClick={function (event) {
                      event.stopPropagation();
                      contextedModal.modal?.confirm({
                        title: "删除",
                        content: `确定删除文件 ${item.name}?`,
                        onOk() {
                          return deleteFile({ id: item.id }).then(() => {
                            contextedMessage.message?.success("成功删除");
                            reload();
                          });
                        },
                      });
                    }}
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  avatar={<Icon icon={FileSvg} />}
                  description={`${item.created_user?.name} ${item.created_at}`}
                />
              </List.Item>
            )}
          />
        )}

      {listType === "item" && (
        <Row gutter={[theme.padding, theme.padding]}>
          {folder.list.map((item) => (
            <Col flex="100px" key={item.id}>
              <FolderItem
                onTriggerReload={reload}
                item={item}
                onEdit={function () {
                  ref.current?.edit(item).then(reload);
                }}
                onClick={function () {
                  getFolderBy({ pid: item.id });
                }}
              />
            </Col>
          ))}
        </Row>
      )}
      {listType === "item" && folder.current_dir?.file && (
        <Row gutter={[theme.padding, theme.padding]}>
          {folder.current_dir.file.map((item) => (
            <Col flex="100px" key={item.id}>
              <FileItem
                item={item}
                onTriggerReload={reload}
                onClick={function () {
                  window.preload.previewFile(item.full_path).catch((err) => {
                    contextedNotify.notification?.error({
                      message: "文件预览失败",
                      description: err.message,
                    });
                  });
                }}
              />
            </Col>
          ))}
        </Row>
      )}

      <FloatButton.Group shape="square">
        <FloatButton
          description="新建文件夹"
          icon={<Icon  icon={AddSvg} />}
          onClick={() => {
            ref.current?.create(folder).then(() => {
              contextedMessage.message?.success("成功新增");
              reload();
            });
          }}
        />
        {folder.current_dir && folder.current_dir.id !== 0 && (
          <FloatButton
            description="上传文件到当前目录"
            icon={<Icon  icon={UploadSvg} />}
            onClick={() => {
              uploadRef.current
                ?.upload({
                  file_dir_id: folder.current_dir!.id,
                })
                .then(reload);
            }}
          />
        )}
      </FloatButton.Group>
      <EditFolder.default ref={ref} />
      <UploadFile.default ref={uploadRef} />
    </PageWrapper>
  );
}

export default styled(BusinessFile)`
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${(props) => props.theme.margin}px;
  }

  .action {
    display: flex;
    flex-shrink: 0;
    align-items: center;
  }

  .bread {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colorLinkHover};
    }
  }

  .item {
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colorBgTextHover};
    }
  }
`;
