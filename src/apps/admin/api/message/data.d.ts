type MessageListItem = {
  btn_power: BtnPower;
  company: Company;
  company_id: number;
  content: string;
  created_at: string;
  created_id: number;
  created_user: User;
  deleted_at: string;
  id: number;
  path: string;
  /** ;0:推送失败,1:未查看,2:已查看 */
  status: 0 | 1 | 2;
  terminal: string;
  title: string;
  updated_at: string;
  user: User;
  user_id: number;
};
