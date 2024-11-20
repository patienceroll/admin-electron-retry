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
  | "子合同需求单"
  | "生产领料"
  | "生产退料"
  | "库存入库"
  | "库存出库"
  | "附件"
  | "图片"
  | "项目附件";

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
