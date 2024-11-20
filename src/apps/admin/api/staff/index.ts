import fetch from "src/util/fetch";

export const StaffStatus = new Map<
  StaffListItemStatus,
  EnumValue<StaffListItemStatus>
>([
  [0, { value: 0, color: "rgba(0, 0, 0, 0.25)", text: "离职" }],
  [1, { value: 1, color: "#cfc922", text: "试用" }],
  [2, { value: 2, color: "green", text: "转正" }],
]);

/**
 * 员工-列表
 */
export function getStaffList(
  params: ListParam & { department_id?: DepartmentListItem["id"] }
) {
  return fetch.GET<List<StaffListItem>>(fetch.base(`/api/staff/list`), params);
}

/**
 * 员工-选项
 */
export function getStaffOption(params: {
  department_id?: DepartmentListItem["id"];
}) {
  return fetch.GET<StaffListItem[]>(fetch.base(`/api/staff/list`), params);
}

/**
 * 员工-详情
 */
export function getStaffDetail(params: Pick<StaffListItem, "id">) {
  return fetch.GET<StaffDetail>(fetch.base(`/api/staff/detail`), params);
}

/**
 * 员工-添加
 */
export function addStaff(params: any) {
  return fetch.POST(fetch.base(`/api/staff`), params);
}

/**
 * 员工-编辑
 */
export function editStaff(params: any) {
  return fetch.PUT(fetch.base(`/api/staff`), params);
}

/**
 * 员工-删除
 */
export function deleteStaff(params: Pick<StaffListItem, "id">) {
  return fetch.DELETE(fetch.base(`/api/staff`), params);
}

/** 员工 设置角色 */
export function postStaffRole(params: {
  staff_id: Staff["id"];
  role_ids: RoleListItem["id"][];
}) {
  return fetch.POST(fetch.base(`/api/staff/role`), params);
}



/**
 * 紧急联系人-列表
 */
export function getStaffContactList(
  params: ListParam & {
    staff_id: Staff["id"];
  },
) {
  return fetch.GET<List<StaffContact>>(
    fetch.base(`/api/staff-contact/list`),
    params,
  );
}

/**
 * 紧急联系人-详情
 */
export function getStaffContact(params: Pick<StaffContact, "id">) {
  return fetch.GET<Staff>(fetch.base(`/api/staff-contact/detail`), params);
}

/**
 * 紧急联系人-添加
 */
export function addStaffContact(params: any) {
  return fetch.POST(fetch.base(`/api/staff-contact`), params);
}

/**
 * 紧急联系人-编辑
 */
export function editStaffContact(params: any) {
  return fetch.PUT(fetch.base(`/api/staff-contact`), params);
}

/**
 * 紧急联系人-删除
 */
export function deleteStaffContact(params: Pick<StaffContact, "id">) {
  return fetch.DELETE(fetch.base(`/api/staff-contact`), params);
}
