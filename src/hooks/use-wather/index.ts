import { useRef } from "react";
import useUpdate from "../use-update";

export default function (init: boolean | (() => boolean) = false) {
  const [update] = useUpdate();

  const store = useRef({
    whether: init instanceof Function ? init() : init,
    setTrue() {
      store.current.whether = true;
      update();
    },
    setFalse() {
      store.current.whether = false;
      update();
    },
    toggle() {
      store.current.whether = !store.current.whether;
      update();
    },
    setValue(value: boolean) {
      store.current.whether = value;
      update();
    },
  });

  return [store.current] as const;
}
