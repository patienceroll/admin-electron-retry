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
  /** 获取当前登录的用户操作权限信息 */
  getLocalUserPermission: () => Record<string, Record<string, boolean>>;
  /** 获取当前用户是否有权限 */
  getLocalUserHasPermission: (path: string, slug: PermissionSlugType) => boolean;
  /** 设置常用菜单(如果没有数据则增加,如果有数据则设置数据的count) */
  setLocalUserComonlyMenu: (menu: ConmonlyMenu[]) => void;
  /** 获取当前用户常用菜单 */
  getLocalUserComonlyMenu: () => ConmonlyMenu[];
  /** 清空当前登录账户保存的相关信息 */
  resetUserInfo: VoidFunction;
  /** 
   * 当前通用菜单变化
   * @description 这个方法 在src\client\channel\local\main.ts 文件里面触发,目前只向所有菜单页面触发了事件 */
  onLocalUserComonlyMenuChange: (
    callback: (menu: ConmonlyMenu[]) => void
  ) => DisposeFunction;
};

