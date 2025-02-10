import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";

export default function <
  Params extends Record<string, number | string>,
  Api extends (params: Params) => Promise<BaseResponse<RenderConfig>>
>(api: Api, params: Params) {
  const [tempParams, setTempParams] = useState<Params>();

  const [renderNames, setRenderNames] = useState<RenderConfig>({
    attr_fields: [],
    unit_fields: [],
  });

  const getData = useCallback(
    (params: Params) => {
      return api(params).then((res) => {
        const { attr_fields, unit_fields } = res.data;
        setRenderNames({
          attr_fields: attr_fields || [],
          unit_fields: unit_fields || [],
        });
      });
    },
    [api]
  );

  useEffect(() => {
    if (JSON.stringify(tempParams) !== JSON.stringify(params)) {
      setTempParams(params);
      getData(params);
    }
  }, [getData, params, tempParams]);

  const attrColumn = useMemo(() => {
    return renderNames.attr_fields.map<ProColumns<any>>((item) => ({
      title: item.name,
      dataIndex: item.key,
      renderText: (_, row: any) => row.material_sku?.[item.key],
    }));
  }, [renderNames.attr_fields]);

  const unitColumn = useMemo(() => {
    return renderNames.unit_fields.map<ProColumns<any>>((item) => ({
      title: item.name,
      dataIndex: item.key,
      renderText: (_, row: any) => row.unit_arr?.[item.key],
    }));
  }, [renderNames.unit_fields]);

  const reload = useCallback(() => {
    if (tempParams) return getData(tempParams);
    return Promise.reject();
  }, [getData, tempParams]);

  const data = useMemo(
    () => ({
      renderNames,
      attrColumn,
      unitColumn,
      reload,
    }),
    [attrColumn, reload, renderNames, unitColumn]
  );

  return [data] as const;
}
