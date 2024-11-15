import { NotificationInstance } from "antd/lib/notification/interface";

type EnvImporter = {
  notify?: NotificationInstance;
};

const store: EnvImporter = {};

export default {
  get notification() {
    return store.notify;
  },
  set notification(v) {
    store.notify = v;
  },
};
