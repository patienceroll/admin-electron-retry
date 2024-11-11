import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Segmented } from "antd";

import Icon from "src/framework/component/icon";

import logo from "src/assets/logo/logo@512x512.png";
import menuSvg from "src/assets/svg/menu.svg";
import minimizeSvg from "src/assets/svg/minimize.svg";
import maximizeSvg from "src/assets/svg/maximize.svg";
import unmaximizeSvg from "src/assets/svg/unmaximize.svg";
import closeSvg from "src/assets/svg/close.svg";

function Component(props: StyledWrapComponents) {
  const { colorTextBase } = useTheme();

  const [isMaximize, setIsMaximize] = useState(() =>
    window.preload.isMaximize()
  );
  const [routes, setRoutes] = useState(() => window.preload.getRoutes());

  useEffect(() => {
    return window.preload.onMaximize(() => setIsMaximize(true));
  }, []);

  useEffect(() => {
    return window.preload.onUnmaximize(() => setIsMaximize(false));
  }, []);

  useEffect(() => {
    return window.preload.onRoutesChange(setRoutes);
  }, []);

  return (
    <div className={props.className}>
      <div className="bar">
        <div className="menu-wrapper">
          <Icon
            className="menu"
            icon={menuSvg}
            width={20}
            height={20}
            onClick={() => {
              if (window.preload.isMenuShowed()) {
                window.preload.hideMenu();
              } else {
                window.preload.showMenu();
              }
            }}
          />
        </div>
        <div className="title">
          <img src={logo} />
          &nbsp;
          <span>DOMS</span>
        </div>

        <div className="content">
          <div className="tabs">
            <Segmented
              onChange={(path) => {
                const item = routes.routes.find((tab) => tab.path === path);
                if (item) {
                  window.preload.open(item.path, item.name);
                }
              }}
              value={routes.current}
              options={routes.routes.map((item) => ({
                value: item.path,
                label: (
                  <div style={{ display: "flex" }}>
                    <span>{item.name}</span>
                    {routes.routes.length !== 1 && (
                      <div
                        className="close-tab"
                        onClick={(e) => {
                          e.preventDefault();
                          window.preload.close(item.path);
                        }}
                      >
                        <Icon icon={closeSvg} fill={colorTextBase} />
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
          </div>

          <div className="reduce" />
        </div>

        <div className="options">
          <div className="option" onClick={window.preload.minimize}>
            <Icon icon={minimizeSvg} />
          </div>

          {isMaximize && (
            <div className="option" onClick={window.preload.unmaximize}>
              <Icon icon={unmaximizeSvg} />
            </div>
          )}

          {!isMaximize && (
            <div className="option" onClick={window.preload.maximize}>
              <Icon icon={maximizeSvg} />
            </div>
          )}

          <div className="option" onClick={window.preload.quit}>
            <Icon icon={closeSvg} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Component)`
  height: 30px;
  background-color: ${(props) => props.theme.colorPrimaryBg};

  .bar {
    height: 30px;
    display: flex;
    user-select: none;
  }

  .menu-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0 8px;
    &:hover {
      background-color: ${(props) => props.theme.colorBgTextHover};
      cursor: pointer;

      .menu {
        fill: ${(props) => props.theme.colorPrimaryActive};
      }
    }
  }

  .menu {
    fill: ${(props) => props.theme.colorPrimary};
  }

  .title {
    flex-shrink: 0;
    padding-inline: 8px;
    cursor: default;

    > img {
      width: 18px;
      height: 18px;
      line-height: 30px;
      vertical-align: middle;
    }

    > span {
      font-size: 16px;
      line-height: 30px;
      vertical-align: middle;
    }
  }

  .content {
    flex: 1;
    display: flex;
  }

  .tabs {
    height: 100%;
    flex-shrink: 0;
    cursor: default;
    display: flex;
    align-items: center;
  }

  .reduce {
    flex: 1;
    -webkit-app-region: drag;
  }

  .close-tab {
    width: 14px;
    height: 14px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-sizing: border-box;

    svg {
      width: 8px;
      height: 8px;
    }
  }

  .options {
    flex-shrink: 0;
    display: flex;
  }

  .option {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.theme.colorPrimaryBg};
    &:hover {
      background-color: ${(props) => props.theme.colorPrimaryActive};
    }

    svg {
      height: 16px;
      width: 16px;
      fill: ${(props) => props.theme.colorTextBase};
    }
  }
`;
