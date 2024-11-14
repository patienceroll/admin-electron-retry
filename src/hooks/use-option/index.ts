import { useRef } from "react";
import useUpdate from "../use-update";

export default function <T, P>(
  Api: (params: OptionParams<P>) => Promise<BaseResponse<T[]>>,
) {
  const [update] = useUpdate();

  const store = useRef({
    params: { page: -1 } as OptionParams<P>,
    list: [] as T[],
    loading: false,
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
    loadOption() {
      store.current.list = [];
      update();
      return store.current.load();
    },
  });

  return [store.current] as const;
}
