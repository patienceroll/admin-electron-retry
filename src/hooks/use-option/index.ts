import { useRef } from "react";
import useUpdate from "../use-update";

export default function <T, P>(
  Api: (params: OptionParams<P>) => Promise<BaseResponse<T[]>>
) {
  const [update] = useUpdate();

  const store = useRef({
    params: { page: -1 } as OptionParams<P>,
    list: [] as T[],
    loading: false,
    /** 不重置数据为空,直接加载 */
    load() {
      store.current.loading = true;
      update();
      return Api(store.current.params)
        .then((res) => {
          store.current.list = res.data as T[];
          return store.current.list;
        })
        .finally(() => {
          store.current.loading = false;
          update();
        });
    },
    /**  重置数据为空并加载 */
    loadOption() {
      store.current.list = [];
      update();
      return store.current.load();
    },

  });

  return [store.current] as const;
}
