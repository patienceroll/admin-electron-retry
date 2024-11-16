import { HookAPI } from "antd/es/modal/useModal";

type ContextedNotify = {
  modal?: HookAPI;
};

const store: ContextedNotify = {};

export default {
  get modal() {
    return store.modal;
  },
  set modal(v) {
    store.modal = v;
  },
};
