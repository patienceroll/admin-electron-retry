import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel } from "swiper/modules";
import { useSpring, animated } from "@react-spring/web";
import { FloatButton } from "antd";

import Icon from "src/framework/component/icon";
import Title from "src/framework/component/title";
import Item from "src/framework/menu/components/item";
import FadeInWrapper from "src/framework/component/fade-in-wrapper";
import PageWrapper from "../component/page-wrapper";
import * as SystemConfig from "./components/system-config";

import images from "src/assets/images";

import HomeSvg from "src/assets/svg/home.svg";
import clientSvg from "src/assets/svg/client.svg";
import systemSvg from "src/assets/svg/system.svg";
import visualizationSvg from "src/assets/svg/visualization.svg";
import organizationSvg from "src/assets/svg/organization.svg";
import projectSvg from "src/assets/svg/project.svg";
import qualitySvg from "src/assets/svg/quality.svg";
import salesSvg from "src/assets/svg/sales.svg";
import paymentSvg from "src/assets/svg/payment.svg";
import administrationSvg from "src/assets/svg/administration.svg";
import materialSvg from "src/assets/svg/material.svg";
import supplierSvg from "src/assets/svg/supplier.svg";
import fileSvg from "src/assets/svg/file.svg";
import logisticsSvg from "src/assets/svg/logistics.svg";
import inventorySvg from "src/assets/svg/inventory.svg";
import purchasSvg from "src/assets/svg/purchas.svg";
import approvalSvg from "src/assets/svg/approval.svg";
import produceSvg from "src/assets/svg/produce.svg";
import jihuiSvg from "src/assets/svg/chance.svg";
import approvalRecordSvg from "src/assets/svg/approval-record.svg";

import "swiper/css";
import "swiper/css/scrollbar";

export const IconMap = {
  "approval-record": approvalRecordSvg,
  home: HomeSvg,
  client: clientSvg,
  system: systemSvg,
  visualization: visualizationSvg,
  organization: organizationSvg,
  project: projectSvg,
  quality: qualitySvg,
  sales: salesSvg,
  payment: paymentSvg,
  administration: administrationSvg,
  material: materialSvg,
  supplier: supplierSvg,
  file: fileSvg,
  logistics: logisticsSvg,
  inventory: inventorySvg,
  purchas: purchasSvg,
  approval: approvalSvg,
  produce: produceSvg,
  jihui: jihuiSvg,
};

function Menu(props: StyledWrapComponents<{ darkMode: boolean }>) {
  const { className, darkMode } = props;
  const systemConfig = SystemConfig.createRef();
  const theme = useTheme();
  const [div, setDiv] = useState<HTMLDivElement | null>(null);

  const navItemAnimate = useSpring({
    // 初始状态，设置 y 坐标为 0
    from: { y: 0 },
    // 目标状态，设置 y 坐标为 -20（向下跳跃），并且透明度为 1（显示）
    to: async (next, cancel) => {
      // 等待下一次动画开始
      await next({ y: -10 });
      // 模拟跳跃效果，先向上移动再落回
      await next({ y: 0 });
      // 可选：跳跃后稍微下移
      await next({ y: -4 });
      // 回到原位
      await next({ y: 0 });
    },
    // 配置动画参数，如持续时间和缓动函数
    config: { duration: 60 },
  });

  // 当前用户的菜单
  const [menus, setMenus] = useState(() => window.preload.getLocalUserMenu()!);

  // 当前展示的子菜单
  const [currentMenu, setCurrentMenu] = useState<UserMenu>();

  // 常用菜单
  const [commonlyUsed, setConmonlyUsed] = useState<ConmonlyMenu[]>(() =>
    window.preload.getLocalUserComonlyMenu()
  );

  function pushARecordToLocal(params: UserMenu) {
    setConmonlyUsed((t) => {
      let newData: ConmonlyMenu[] = [];
      if (t.find((item) => item.id === params.id)) {
        const temp = t.map((i) => ({
          ...i,
          count: params.id === i.id ? i.count + 1 : 1,
        }));
        newData = temp.sort((a, b) => b.count - a.count);
      } else {
        newData = Array.from(t);
        newData.push({ ...params, count: 1 });
        newData = newData.sort((a, b) => b.count - a.count);
      }
      window.preload.setLocalUserComonlyMenu(newData);
      return newData;
    });
  }

  return (
    <PageWrapper className={className}>
      <div className="nav">
        <div className="scrollbar" ref={setDiv} />
        <Swiper
          style={{ height: 102, boxShadow: theme.boxShadow }}
          slidesPerView={"auto"}
          scrollbar={{ draggable: true, el: div }}
          mousewheel={{ thresholdDelta: 4, sensitivity: 300 }}
          direction="horizontal"
          modules={[Scrollbar, Mousewheel]}
        >
          {menus.map((item) => {
            const active = item.id === currentMenu?.id;
            return (
              <SwiperSlide className="swiper-slide" key={item.id}>
                <div
                  className={`nav-item ${active ? "nav-item-active" : ""}`}
                  onClick={() => {
                    setCurrentMenu(item);
                  }}
                >
                  <animated.div style={active ? navItemAnimate : undefined}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Icon
                        width={28}
                        height={28}
                        icon={IconMap[item.icon as keyof typeof IconMap]}
                        fill={active ? theme.colorPrimary : theme.colorText}
                      />
                    </div>
                    <div style={{ marginTop: 8 }}>{item.name}</div>
                  </animated.div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

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
                      window.preload.hideMenu();
                      pushARecordToLocal(item);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {currentMenu && (
            <FadeInWrapper>
              <Title style={{ marginTop: theme.margin * 2 }}>
                {currentMenu.name}菜单
              </Title>
              <div className="child-wrapper">
                {currentMenu.child instanceof Array &&
                  currentMenu.child.length !== 0 &&
                  currentMenu!.child!.map((item) => (
                    <Item
                      darkMode={darkMode}
                      item={item}
                      key={item.id}
                      onClick={() => {
                        window.preload.open(item.path, item.name);
                        window.preload.hideMenu();
                        pushARecordToLocal(item);
                      }}
                    />
                  ))}
                {(!currentMenu.child || currentMenu.child.length === 0) && (
                  <Item
                    darkMode={darkMode}
                    item={currentMenu}
                    key={currentMenu.id}
                    onClick={() => {
                      window.preload.open(currentMenu.path, currentMenu.name);
                      window.preload.hideMenu();
                      pushARecordToLocal(currentMenu);
                    }}
                  />
                )}
              </div>
            </FadeInWrapper>
          )}
        </div>
      </div>
      <FloatButton
        shape="square"
        type="primary"
        description="系统设置"
        onClick={() => {
          systemConfig.current?.open();
        }}
        icon={<Icon fill={theme.colorBgBase} icon={systemSvg} />}
      />
      <SystemConfig.default ref={systemConfig} />
    </PageWrapper>
  );
}

export default styled(Menu)`
  height: 100vh;
  width: 100vw;
  display: flex;
  padding: 0;
  justify-content: center;
  align-items: top;
  background-color: ${(props) =>
    props.darkMode ? props.theme.colorBgBase : "#f5f7ff"};

  background-image: ${(props) =>
    props.darkMode ? "none" : ` url(${images.bg})`};
  background-size: 100%;
  background-repeat: no-repeat;

  .nav {
    max-width: 100%;
    border-radius: ${(props) => props.theme.borderRadius}px;
    box-shadow: ${(props) => props.theme.boxShadow};
    background-color: ${(props) => props.theme.colorBgBlur};
  }

  .swiper-slide {
    width: fit-content;
    box-sizing: border-box;
    border-top: 1px solid ${(props) => props.theme.colorBorder};
    border-bottom: 1px solid ${(props) => props.theme.colorBorder};
    border-right: 1px solid ${(props) => props.theme.colorBorder};
    &:nth-child(1) {
      border-left: 1px solid ${(props) => props.theme.colorBorder};
    }
  }

  .scrollbar {
    height: 2px;
    background-color: ${(props) => props.theme.colorPrimaryBg};
    .swiper-scrollbar-drag {
      background-color: ${(props) => props.theme.colorPrimary};
    }
  }

  .nav-item {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    &:hover {
      background-color: ${(props) => props.theme.colorPrimaryBgHover};
      box-shadow: ${(props) => props.theme.boxShadow};
      color: ${(props) => props.theme.colorPrimary};
      svg {
        fill: ${(props) => props.theme.colorPrimary};
      }
    }
  }

  .nav-item-active {
    background-color: ${(props) => props.theme.colorPrimary};
    color: ${(props) => props.theme.colorBgBase};

    svg {
      fill: ${(props) => props.theme.colorBgBase};
    }
  }

  .link-wrapper {
    height: calc(100vh - 104px);
    box-sizing: border-box;
    padding: ${(props) => props.theme.padding}px;
  }

  .child-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .child-nav {
    margin-top: ${(props) => props.theme.padding}px;
    width: 33%;
    cursor: pointer;

    &:hover {
      color: ${(props) => props.theme.colorPrimaryActive};
    }
  }
`;
