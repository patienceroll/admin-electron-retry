declare const FRAMEWORK_WEBPACK_ENTRY: string;
declare const FRAMEWORK_PRELOAD_WEBPACK_ENTRY: string;
declare const ADMIN_WEBPACK_ENTRY: string;
declare const ADMIN_PRELOAD_WEBPACK_ENTRY: string;

const app: Record<Apps, { preload: string; entry: string }> = {
  admin: {
    preload: ADMIN_PRELOAD_WEBPACK_ENTRY,
    entry: ADMIN_WEBPACK_ENTRY,
  },
  framework: {
    preload: FRAMEWORK_PRELOAD_WEBPACK_ENTRY,
    entry: FRAMEWORK_WEBPACK_ENTRY,
  },
};

export default {
  FRAMEWORK_WEBPACK_ENTRY,
  FRAMEWORK_PRELOAD_WEBPACK_ENTRY,
  ADMIN_WEBPACK_ENTRY,
  ADMIN_PRELOAD_WEBPACK_ENTRY,
  app
};
