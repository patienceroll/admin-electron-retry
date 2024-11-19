import React, { PropsWithChildren } from "react";

export default function (props: PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.children}
    </div>
  );
}
