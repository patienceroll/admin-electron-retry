type LocalPreload = {
  setLocalToken: (token: string) => void;
  getLocalToken: () => string | undefined;
  /** 设置当前选择的入职公司 */
  setLocalCompany: (company: Company) => void;
  /** 获取当前选择的入职公司 */
  getLocalCompany: () => Company | undefined;
  /** 设置当前登录的用户的菜单 */
  setLocalUserMenu: (menu: UserMenu[]) => void;
  /** 获取当前登录的用户的菜单 */
  getLocalUserMenu: () => UserMenu[] | undefined;
  /** 设置当前登录的用户信息 */
  setLocalUser: (menu: User) => void;
  /** 获取当前登录的用户信息 */
  getLocalUser: () => User | undefined;
};
