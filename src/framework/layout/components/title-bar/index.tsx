import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Segmented } from "antd";

import logo from "src/assets/logo/logo@512x512.png";

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

  useEffect(() => {
    window.preload.open("/user-info", "用户信息");
  }, []);

  return (
    <div className={props.className}>
      <div className="bar">
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
                        onClick={() => window.preload.close(item.path)}
                      >
                        <svg
                          viewBox="0 0 1024 1024"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill={colorTextBase}
                            d="M577.574 512l343.643-343.696a45.008 45.008 0 0 0 0-63.3l-1.885-1.842a44.997 44.997 0 0 0-63.288 0L512.348 447.29 168.662 103.162a45.008 45.008 0 0 0-63.3 0l-1.874 1.874a44.165 44.165 0 0 0 0 63.3L447.174 512 103.488 855.686a44.987 44.987 0 0 0 0 63.299l1.875 1.874a45.008 45.008 0 0 0 63.299 0l343.686-343.685 343.696 343.685a44.997 44.997 0 0 0 63.288 0l1.885-1.874a45.008 45.008 0 0 0 0-63.3z"
                          />
                        </svg>
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
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M52.37546667 445.632l933.27253333-2.1248 0.17386667 68.26666667-933.27253334 2.1248z" />
            </svg>
          </div>

          {isMaximize && (
            <div className="option" onClick={window.preload.unmaximize}>
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="M165.712 334.501v537.51h537.51V334.5z m179.17-179.17v89.585h447.924v447.925h89.585V155.33z m-89.585-89.584h716.68v716.678h-179.17v179.17H76.126V244.916h179.17z" />
              </svg>
            </div>
          )}

          {!isMaximize && (
            <div className="option" onClick={window.preload.maximize}>
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="M180.592 168.48v683.46h683.46V168.48zM95.16 83.049h854.324v854.325H95.16z" />
              </svg>
            </div>
          )}

          <div className="option" onClick={window.preload.quit}>
            <svg
              className="close"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M577.574 512l343.643-343.696a45.008 45.008 0 0 0 0-63.3l-1.885-1.842a44.997 44.997 0 0 0-63.288 0L512.348 447.29 168.662 103.162a45.008 45.008 0 0 0-63.3 0l-1.874 1.874a44.165 44.165 0 0 0 0 63.3L447.174 512 103.488 855.686a44.987 44.987 0 0 0 0 63.299l1.875 1.874a45.008 45.008 0 0 0 63.299 0l343.686-343.685 343.696 343.685a44.997 44.997 0 0 0 63.288 0l1.885-1.874a45.008 45.008 0 0 0 0-63.3z" />
            </svg>
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
    &:hover {
      -webkit-app-region: drag;
    }
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
