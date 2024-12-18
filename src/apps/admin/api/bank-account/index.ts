import fetch from "src/util/fetch";
/**
 * 账户-列表
 */
export function getBankAccountList(
  params: ListParam & {
    /**  '类型;1:公司,2:客户,3:供应商,4:员工' */
    type: 1 | 2 | 4 | 3;
    /** 目标表id */
    table_id?: number;
    table?:string
  }
) {
  return fetch.GET<List<BankAccount>>(
    fetch.base(`/api/bank-account/list`),
    params
  );
}
/**
 * 账户-选项
 */
export function getBankAccountOptions(
  params: ListParam & {
    /**  '类型;1:公司,2:客户,3:供应商,4:员工' */
    type: 1 | 2 | 4 | 3;
    /** 目标表id */
    table_id?: number;
    table?:string
  }
) {
  return fetch.GET<BankAccount[]>(fetch.base(`/api/bank-account/list`), params);
}

/**
 * 账户-详情
 */
export function getBankAccount(params: Pick<BankAccount, "id">) {
  return fetch.GET<BankAccount>(fetch.base(`/api/bank-account/detail`), params);
}

/**
 * 账户-添加
 */
export function addBankAccount(params: any) {
  return fetch.POST(fetch.base(`/api/bank-account`), params);
}

/**
 * 账户-编辑
 */
export function editBankAccount(params: any) {
  return fetch.PUT(fetch.base(`/api/bank-account`), params);
}

/**
 * 账户-删除
 */
export function deleteBankAccount(params: Pick<BankAccount, "id">) {
  return fetch.DELETE(fetch.base(`/api/bank-account`), params);
}
