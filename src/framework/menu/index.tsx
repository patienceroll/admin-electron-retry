import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel } from "swiper/modules";
import { useSpring, animated } from "@react-spring/web";

import Icon from "src/framework/component/icon";
import HomeSvg from "src/assets/svg/home.svg";

import "swiper/css";
import "swiper/css/scrollbar";

function Menu(props: StyledWrapComponents) {
  const { className } = props;
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
  const [commonlyUsed, setConmonlyUsed] = useState<UserMenu[]>(
    () => (localStorage.getItem("commonlyUsed") as unknown as UserMenu[]) || []
  );

  return (
    <div className={className} onClick={window.preload.hideMenu}>
      <div
        className="nav"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="commonly"></div>
        <div className="scrollbar" ref={setDiv} />
        <Swiper
          slidesPerView={"auto"}
          scrollbar={{ draggable: true, el: div }}
          mousewheel={{ thresholdDelta: 4, sensitivity: 300 }}
          direction="horizontal"
          modules={[Scrollbar, Mousewheel]}
        >
          {menus.map((item) => (
            <SwiperSlide className="swiper-slide" key={item.id}>
              <div
                className={`nav-item ${
                  item.id === currentMenu?.id ? "nav-item-active" : ""
                }`}
                onMouseEnter={() => setCurrentMenu(item)}
              >
                <animated.div
                  style={
                    item.id === currentMenu?.id ? navItemAnimate : undefined
                  }
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Icon
                      width={28}
                      height={28}
                      icon={HomeSvg}
                      fill={theme.colorText}
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>{item.name}</div>
                </animated.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="child-wrapper"></div>
      </div>
    </div>
  );
}

export default styled(Menu)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: top;
  background-color: ${(props) => props.theme.colorBgMask};

  .nav {
    max-width: 100%;
    border-radius: ${(props) => props.theme.borderRadius}px;
    box-shadow: ${(props) => props.theme.boxShadow};
    background-color: ${(props) => props.theme.colorBgLayout};
  }

  .swiper-slide {
    width: fit-content;
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
    }
  }

  .nav-item-active {
    background-color: ${(props) => props.theme.colorPrimary};
    color: ${(props) => props.theme.colorText};
  }

  .child-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
`;
