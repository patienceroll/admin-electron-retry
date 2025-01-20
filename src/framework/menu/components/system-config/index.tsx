import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Descriptions, Drawer, Radio } from "antd";
import styled from "styled-components";

import useWather from "src/hooks/use-wather";
import contextedModal from "src/framework/component/contexted-modal";

type Ref = {
  open: () => void;
};

export function createRef() {
  return useRef<Ref>(null);
}

const SystemConfig = forwardRef<Ref>(function (props, ref) {
  const [open] = useWather();
  const [theme, setTheme] = useState(() => window.preload.getTheme());

  useEffect(() => {
    return window.preload.onThemeChange(setTheme);
  }, []);

  useImperativeHandle(ref, () => ({
    open() {
      open.setTrue();
    },
  }));

  return (
    <Drawer open={open.whether} onClose={open.setFalse} title="系统设置">
      <Descriptions column={1} layout="vertical">
        <Descriptions.Item label="系统布局">
          <Radio.Group
            value={theme.layout}
            onChange={(e) => {
              window.preload.setTheme({ layout: e.target.value });
            }}
          >
            <Radio value="normal">默认</Radio>
            <Radio value="compact">紧凑</Radio>
          </Radio.Group>
        </Descriptions.Item>
        <Descriptions.Item label="用户信息">
          <Button
            type="primary"
            onClick={() => {
              contextedModal.modal?.confirm({
                title: "清除用户信息?",
                content: "常用菜单等用户数据将会被清空,并且您需要重新登录。",
                onOk() {
                  window.preload.resetUserInfo();
                  window.preload.login()
                },
              });
            }}
          >
            清除用户信息
          </Button>
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
});

export default styled(SystemConfig)``;
