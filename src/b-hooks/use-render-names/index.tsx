import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    if (JSON.stringify(tempParams) !== JSON.stringify(params)) {
      setTempParams(params);
      api(params).then((res) => {
        setRenderNames(res.data);
      });
    }
  }, [api, params, tempParams]);

  const attrColumn = useMemo(() => {
    return renderNames.attr_fields.map<ProColumns<any>>((item) => ({
      title: item.name,
      renderText: (_, row: any) => row.material_sku?.[item.key],
    }));
  }, [renderNames.attr_fields]);

  const unitColumn = useMemo(() => {
    return renderNames.unit_fields.map<ProColumns<any>>((item) => ({
      title: item.name,
      renderText: (_, row: any) => row.material_sku?.[item.key],
    }));
  }, [renderNames.unit_fields]);

  return [renderNames, attrColumn, unitColumn] as const;
}
