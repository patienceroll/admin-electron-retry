import { Divider } from "antd";
import React, { useState } from "react";
import styled from "styled-components";

function Menu(props: StyledWrapComponents) {
  const { className } = props;
  const [menus, setMenus] = useState(() => window.preload.getLocalUserMenu()!);
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
        <div className="commonly">
          <Divider orientation="left">常用</Divider>
        </div>
        <div className="menu-wrapper">
          <Divider orientation="left">菜单</Divider>
          {menus.map((item) => (
            <div
              className="menu-item"
              key={item.id}
              onMouseEnter={() => {
                setChildMenu(item.child || []);
              }}
              onClick={() => {
                if (item.child instanceof Array && item.child.length !== 0) {
                } else {
                  window.preload.hideMenu();
                  window.preload.open(item.path, item.name);
                }
              }}
            >
              {item.name}
            </div>
          ))}
        </div>

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
  align-items: center;
  background-color: ${(props) => props.theme.colorBgMask};

  .nav {
    width: 80vw;
    height: 80vh;
    border-radius: ${(props) => props.theme.borderRadius}px;
    box-shadow: ${(props) => props.theme.boxShadow};
    background-color: ${(props) => props.theme.colorBgLayout};
  }

  .menu-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .menu-item {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colorPrimaryBgHover};
    }
  }

  .child-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
`;
