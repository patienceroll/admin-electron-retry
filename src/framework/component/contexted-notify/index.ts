import { NotificationInstance } from "antd/lib/notification/interface";

type ContextedNotify = {
  notify?: NotificationInstance;
};

const store: ContextedNotify = {};

export default {
  get notification() {
    return store.notify;
  },
  set notification(v) {
    store.notify = v;
  },
};
