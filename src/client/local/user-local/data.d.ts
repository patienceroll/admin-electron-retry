type LocalUserData = {
  token?: string;
  company?: Company;
  menu?: UserMenu[];
  user?: User;
  /** 权限 第一个 key 为 菜单 path 第二个为 权限 slug */
  permission?: Record<string, Record<string, boolean>>;
  /** 常用菜单 */
  conmonlyMenu: ConmonlyMenu[];
};

/** 常用菜单 */
type ConmonlyMenu = UserMenu & {
  count: number;
};
