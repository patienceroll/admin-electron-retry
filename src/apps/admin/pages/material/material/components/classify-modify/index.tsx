import React, { forwardRef, useState } from "react";

import { Modal } from "antd";

import useWather from "src/hooks/use-wather";

export default forwardRef(function () {

    const [open] = useWather();
    const [item,setItem] = useState<MaterialClassifyTree>()
  
    return <Modal title={item?'编辑分类':'新建分类'} ></Modal>;
  })
