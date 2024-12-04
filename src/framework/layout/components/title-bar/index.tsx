import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";

import Icon from "src/framework/component/icon";

import logo from "src/assets/logo/logo@512x512.png";
import menuSvg from "src/assets/svg/menu.svg";
import minimizeSvg from "src/assets/svg/minimize.svg";
import maximizeSvg from "src/assets/svg/maximize.svg";
import unmaximizeSvg from "src/assets/svg/unmaximize.svg";
import closeSvg from "src/assets/svg/close.svg";

import "swiper/css";
import "swiper/css/scrollbar";

function Component(props: StyledWrapComponents) {
  const theme = useTheme();

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
            <Swiper
              className="swiper"
              slidesPerView={"auto"}
              direction="horizontal"
              modules={[Mousewheel, FreeMode]}
              freeMode
              mousewheel={{ thresholdDelta: 4, sensitivity: 300 }}
            >
              {routes.routes.map((item) => (
                <SwiperSlide
                  key={item.path}
                  className={`tab-item ${
                    item.path === routes.current ? "tab-item-active" : ""
                  }`}
                  onClick={function () {
                    const instance = routes.routes.find(
                      (tab) => tab.path === item?.path
                    );
                    if (instance) {
                      window.preload.switchPage(instance.path);
                    }
                  }}
                >
                  <div>{item.name}</div>
                  <div className="close-icon-wrapper">
                    <Icon
                      icon={closeSvg}
                      width={theme.fontSize - 2}
                      height={theme.fontSize - 2}
                      onClick={(e) => {
                        e.preventDefault();
                        window.preload.close(item.path);
                      }}
                      fill={
                        routes.current === item.path
                          ? theme.colorBgBase
                          : theme.colorTextBase
                      }
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
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
    flex-shrink: 1;
    flex-grow: 0;
    flex-basis: auto;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -5px;
      right: -5px;
      box-shadow: inset -5px 0 10px -10px
          ${(props) => props.theme.colorTextBase},
        inset 5px 0 10px -10px ${(props) => props.theme.colorTextBase};
      z-index: 2; /* 确保阴影在最上层 */
      pointer-events: none;
    }
  }

  .tab-item {
    display: flex;
    width: fit-content;
    padding-left: ${(props) => props.theme.padding / 2}px;
    line-height: 30px;
    color: ${(props) => props.theme.colorTextBase};
    background-color: ${(props) => props.theme.colorPrimaryBg};
    cursor: pointer;
    font-size: ${(props) => props.theme.fontSize};

    &:hover {
      background-color: ${(props) => props.theme.colorPrimaryBgHover};
    }

    .close-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-inline: ${(props) => props.theme.padding - 7}px;
      &:hover {
        background-color: ${(props) => props.theme.colorBgTextActive};
      }
    }
  }

  .tab-item-active {
    cursor: default;
    background-color: ${(props) => props.theme.colorPrimary};
    font-weight: ${(props) => props.theme.fontWeightStrong};
    color: ${(props) => props.theme.colorBgBase};

    &:hover {
      background-color: ${(props) => props.theme.colorPrimary};
    }

    .close-icon-wrapper {
      cursor: pointer;
      &:hover {
        background-color: ${(props) => props.theme.colorPrimaryActive};
      }
    }
  }

  .reduce {
    flex: 1;
    -webkit-app-region: drag;
    min-width: 200px;
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
