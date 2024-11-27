import React from "react";
import styled, { useTheme } from "styled-components";
import { animated, useSpring } from "@react-spring/web";
import { Button, Popover, Space } from "antd";

import FolderSvg from "src/assets/svg/文件夹.svg";
import Icon from "src/framework/component/icon";
import contextedModal from "src/framework/component/contexted-modal";
import contextedMessage from "src/framework/component/contexted-message";
import { deleteFolder } from "src/apps/admin/api/business-file";

function Item(
  props: StyledWrapComponents<
    {
      item: Folder;
      onTriggerReload: VoidFunction;
    } & React.DelHTMLAttributes<HTMLDivElement>
  >
) {
  const { className, item, onTriggerReload, ...restProps } = props;
  const theme = useTheme();

  const [style, api] = useSpring(() => ({
    scale: 1, // 原始大小
    backgroundColor: "transparent",
    config: { mass: 1, tension: 160, friction: 20 }, // 配置动画参数
  }));

  function onDelete() {
    contextedModal.modal?.confirm({
      title: "删除",
      content: `确定删除文件夹 ${item.name}?`,
      onOk() {
        return deleteFolder({ id: item.id }).then(() => {
          contextedMessage.message?.success("成功删除");
          onTriggerReload();
        });
      },
    });
  }

  return (
    <Popover
      placement="bottom"
      content={
        <Space>
          <Button type="primary">编辑</Button>
          <Button type="primary" danger onClick={onDelete}>
            删除
          </Button>
        </Space>
      }
    >
      <animated.div
        className={className}
        style={{ backgroundColor: style.backgroundColor }}
        {...restProps}
        onMouseOver={function () {
          api.start({ scale: 1.1, backgroundColor: theme.colorBgTextHover });
        }}
        onMouseLeave={function () {
          api.start({ scale: 1, backgroundColor: "transparent" });
        }}
      >
        <animated.div className="inner" style={{ scale: style.scale }}>
          <Icon icon={FolderSvg} width={34} height={34} />
          <div className="name">{item.name}</div>
        </animated.div>
      </animated.div>
    </Popover>
  );
}

export default styled(Item)`
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100px;

  .inner {
    text-align: center;
  }

  .name {
    height: 48px;
    line-height: 24px;
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    text-align: center;
  }
`;
