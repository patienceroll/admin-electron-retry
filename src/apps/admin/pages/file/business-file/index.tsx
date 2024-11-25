import styled, { useTheme } from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { Affix, Breadcrumb, List, Segmented } from "antd";

import PageWrapper from "src/framework/component/page-wrapper";
import { getFolder } from "src/apps/admin/api/business-file";
import useWather from "src/hooks/use-wather";
import FolderSvg from "src/assets/svg/文件夹.svg";
import Icon from "src/framework/component/icon";

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
          <div style={{ display: "flex", alignItems: "center" }}>
            <Breadcrumb
              items={[
                {
                  title: "根目录",
                  onClick() {
                    getFolderBy();
                  },
                },
              ]}
            />
          </div>
          <Segmented
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
      {listType === "row" && (
        <List
          dataSource={folder.list}
          renderItem={(item) => (
            <List.Item
              className="item"
              onDoubleClick={() => getFolderBy({ type: 2, pid: item.id })}
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
    </PageWrapper>
  );
}

export default styled(BusinessFile)`
  .top {
    display: flex;
    justify-content: space-between;
    background-color: ${(props) => props.theme.colorBgContainer};
    padding: ${(props) => props.theme.padding}px;
    box-shadow: ${(props) => props.theme.boxShadow};
    border-radius: ${(props) => props.theme.borderRadius}px;
  }

  .item {
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colorBgTextHover};
    }
  }
`;
