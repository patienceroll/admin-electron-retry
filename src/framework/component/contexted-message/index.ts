import { MessageInstance } from "antd/es/message/interface";

type ContextedNotify = {
  message?: MessageInstance;
};

const store: ContextedNotify = {};

export default {
  get message() {
    return store.message;
  },
  set message(v) {
    store.message = v;
  },
};
