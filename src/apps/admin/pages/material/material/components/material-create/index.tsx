import { Modal } from "antd";
import React, { forwardRef, useRef } from "react";

export default forwardRef(function () {
  const promiseResolver = useRef<{
    resolve: (
      value: ClientAddResponse | PromiseLike<ClientAddResponse>
    ) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  return <Modal></Modal>;
});
