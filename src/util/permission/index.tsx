/** 将当前的路由转换为系统菜单的路由 */
function routeToPermisionPath() {
  if (window.preload.isPackaged) {
    return `/${Permission.memoryRouterPath
      .split("/")
      .filter(Boolean)
      .slice(0, 2)
      .join("/")}`;
  } else {
    return `/${window.location.pathname
      .split("/")
      .filter(Boolean)
      .slice(1, 3)
      .join("/")}`;
  }
}

/** 根据当前路由获取菜单权限 */
function getCurrentMenu(path: string) {
  function recusion(menu: UserMenu[], store: UserMenu[]) {
    menu.forEach((item) => {
      store.push(item);
      if (item.child) {
        recusion(item.child, store);
      }
    });
    return store;
  }
  const flatedMenu = recusion(window.preload.getLocalUserMenu() || [], []);
  const menu = flatedMenu.find((item) => item.path === path);
  return menu;
}

/** 获取当前权限 */
function getPermission(slug: PermissionSlugType) {
  return window.preload.getLocalUserHasPermission(routeToPermisionPath(), slug);
}
const Store = {
  memoryRouterPath: "",
};

const Permission = {
  routeToPermisionPath,
  getCurrentMenu,
  getPermission,
  get memoryRouterPath() {
    return Store.memoryRouterPath;
  },
  set memoryRouterPath(value: string) {
    Store.memoryRouterPath = value;
  },
  get menuSlug() {
    return getCurrentMenu(routeToPermisionPath())?.slug;
  },
};

export default Permission;
