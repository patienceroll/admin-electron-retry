
/** 角色 */
type RoleListItem = {
  id: number;
  company_id: number;
  name: string;
  slug: string;
  list: number;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: BlockCreateUser;
  company: Company;
};


/** 角色菜单 */
type RoleMenu = {
    id: number;
    pid: number;
    grade: number;
    level: number;
    name: string;
    slug: string;
    status: number;
    child?: RoleMenu[];
    data_permission: {
      id: number;
      menu_id: Menu["id"];
      department_id: Department["id"];
      department_name: Department["name"];
    }[];
    permission: (Pick<
      Permission,
      "id" | "is_sys" | "list" | "menu_id" | "name" | "slug" | "status"
    > & {
      role_permission: { permission_id: Permission["id"]; id: number }[];
    })[];
  };
  

type Permission = {
  id: number;
  menu_id: number;
  name: string;
  slug: string;
  list: number;
  is_sys: 0 | 1;
  status: number;
  btn_power: BtnPower;
};
