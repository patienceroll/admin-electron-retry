import { Button, Space } from "antd";
import React, { useEffect, useState } from "react";

import styled, { useTheme } from "styled-components";

import PageWrapper from "src/framework/component/page-wrapper";
import Title from "src/framework/component/title";
import Item from "src/framework/menu/components/item";

function Home(porps: StyledWrapComponents<{ darkMode: boolean }>) {
  const { className, darkMode } = porps;

  const theme = useTheme();
  // 常用菜单
  const [commonlyUsed, setConmonlyUsed] = useState<ConmonlyMenu[]>(() =>
    window.preload.getLocalUserComonlyMenu()
  );

  useEffect(() => {
    return window.preload.onLocalUserComonlyMenuChange(setConmonlyUsed);
  }, []);

  return (
    <PageWrapper className={className}>
      <div className="link-wrapper">
        {commonlyUsed.length !== 0 && (
          <div>
            <Title>常用菜单</Title>

            <div>
              {commonlyUsed.slice(0, 10).map((item) => (
                <Item
                  item={item}
                  darkMode={darkMode}
                  key={item.id}
                  onClick={() => {
                    window.preload.open(item.path, item.name);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Space style={{ marginTop: theme.margin }}>
        <Button onClick={window.preload.login}>登录</Button>
        <Button onClick={window.preload.showMenu}>菜单</Button>
      </Space>
    </PageWrapper>
  );
}

export default styled(Home)``;
