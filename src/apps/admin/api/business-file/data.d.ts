type BusinessParams = {
  service:
    | "stock-check"
    | "staff"
    | "project"
    | "business-opportunity"
    | "project-follow"
    | "sales-contract"
    | "sales-order"
    | "purchase-contract"
    | "purchase-order"
    | "purchase-apply"
    | "purchase-receive"
    | "purchase-return"
    | "produce-receive"
    | "produce-return"
    | "material"
    | "in-stock"
    | "out-stock"
    | "produce-confirm"
    | "produce-plan"
    | "produce-daily"
    | "sales-return"
    | "sales-deliver"
    | "material-sku";
  identify: BusinessFileIdentify;
  is_cover: 1 | 0;
  table_id: number;
  file_ids: number[];
};

type BusinessFileIdentify =
  | "头像"
  | "招商银行"
  | "身份证正面"
  | "身份证背面"
  | "毕业证"
  | "学位证"
  | "跟进附件"
  | "点评附件"
  | "合同附件"
  | "业务机会附件"
  | "销售订单"
  | "生产领料"
  | "生产退料"
  | "库存入库"
  | "库存出库"
  | "附件"
  | "图片"
  | "项目附件" |"工程概览";

type FileResponse = {
  created_at: string;
  created_id: number;
  extend: { file_size: number; file_type: string };
  id: number;
  name: string;
  path: string;
  updated_at?: string;
  full_path: string;
};

/** 文件夹 */
type Folder = {
  id: number;
  company_id: number;
  /**  2业务文件 1 公司文件 */
  type: 1 | 2;
  pid: number;
  name: string;
  is_secret: 0 | 1;
  list: number;
  status: number;
  created_id: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
  btn_power: BtnPower;
  created_user: CreateUser | null;
  company: BlockCompany | null;
};

/** 文件夹列表项 */
type FolderListItem = {
  /**  当前文件夹的文件 */
  current_dir?: Folder & {
    /** 文件 */
    file: FolderFile[];
  };
  /** 父文件夹路径 */
  parent_dir: {
    id: number;
    name: string;
  }[];
  /** 文件夹 */
  list: Folder[];
};

/** 文件夹文件项 */
type FolderFile = {
  id: number;
  file_dir_id: number;
  name: string;
  path: string;
  full_path: string;
  extend: {
    file_type: string;
    file_size: number;
  };
  status: number;
  created_id: number;
  created_at: string;
  created_user: BlockCreateUser;
};