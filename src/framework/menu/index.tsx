import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel } from "swiper/modules";

import Icon from "src/framework/component/icon";
import HomeSvg from "src/assets/svg/home.svg";

import "swiper/css";
import "swiper/css/scrollbar";

function Menu(props: StyledWrapComponents) {
  const { className } = props;
  const [div, setDiv] = useState<HTMLDivElement | null>(null);
  // 当前用户的菜单
  const [menus, setMenus] = useState(() => window.preload.getLocalUserMenu()!);
  // 当前选中的一级菜单
  const [] = useState<UserMenu>()

  //
  const [childMenu, setChildMenu] = useState<UserMenu[]>([]);
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
              <div className="nav-item">
                <div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Icon icon={HomeSvg} />
                  </div>
                  <div>{item.name}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="child-wrapper">
          {childMenu.map((item) => item.name)}
        </div>
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
  }

  .nav-item {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: ${(props) => props.theme.colorPrimaryBgHover};
      box-shadow: ${(props) => props.theme.boxShadow};
    }
  }

  .child-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
`;
