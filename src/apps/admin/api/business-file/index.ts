import fetch from "src/util/fetch";

/**
 * 上传(绑定)业务文件
 */
export function bindBusinessFile(data: BusinessParams) {
  return fetch.POST(fetch.base("/api/business-file/bind"), data);
}

/** 上传文件到文件夹 */
export function postFile(params: {
  file_dir_id?: number;
  path: string;
  name: string;
  extend: {
    file_type: string;
    file_size: number;
  };
}) {
  return fetch.POST<FileResponse>(fetch.base("/api/file"), params);
}
