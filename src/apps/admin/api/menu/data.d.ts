/** 菜单 */
type Menu = {
  id: number;
  pid: number;
  name: string;
  level: number;
  icon: string;
  slug: string;
  path: string;
  list: number;
  is_force: 0 | 1;
  /**   '状态;1:有效,2:停用', */
  status: 1 | 2;
  permission: Permission[];
  child?: Menu[];
  menu_staff?: { staff: Staff; id: Staff["id"] }[];
  menu_department?: Department[];
};
