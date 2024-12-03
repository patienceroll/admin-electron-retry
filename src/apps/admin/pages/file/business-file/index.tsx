import styled, { useTheme } from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { Affix, Breadcrumb, Col, List, Row, Segmented } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import { getFolder } from "src/apps/admin/api/business-file";
import useWather from "src/hooks/use-wather";
import FolderSvg from "src/assets/svg/文件夹.svg";
import Icon from "src/framework/component/icon";
import FileSvg from "src/assets/svg/文件.svg";
import FolderItem from "./components/folder-item";
import FileItem from "./components/file-item";
import contextedNotify from "src/framework/component/contexted-notify";
import Title from "src/framework/component/title";

function BusinessFile(props: StyledWrapComponents) {
  const { className } = props;
  const [loading] = useWather();
  const theme = useTheme();

  const [listType, sertListType] = useState<"row" | "item">("item");
  const [folder, setFolder] = useState<FolderListItem>({
    parent_dir: [],
    list: [],
  });

  const getFolderBy = useCallback(
    function (params: Partial<Parameters<typeof getFolder>[0]> = {}) {
      if (loading.whether) return Promise.reject();
      loading.setTrue();
      return getFolder({ pid: 0, type: 2, ...params })
        .then((res) => {
          setFolder(res.data);
        })
        .finally(loading.setFalse);
    },
    [loading]
  );

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
      </Affix>
      {listType === "row" && folder.list.length !== 0 && (
        <List
          dataSource={folder.list}
          renderItem={(item) => (
            <List.Item
              className="item"
              onClick={() => getFolderBy({ type: 2, pid: item.id })}
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
                item={item}
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
    </PageWrapper>
  );
}

export default styled(BusinessFile)`
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${(props) => props.theme.margin}px;
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
