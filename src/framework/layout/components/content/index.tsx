import React, { useEffect, useRef } from "react";
import styled from "styled-components";

function Content(props: StyledWrapComponents) {
  const div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizer = new ResizeObserver(function (entry) {
      const rect = {
        width: entry[0].contentRect.width,
        height: entry[0].contentRect.height,
      };
    });

    if (div.current) resizer.observe(div.current);

    return () => {
      resizer.disconnect();
    };
  }, []);

  return <div className={props.className} ref={div}></div>;
}

export default styled(Content)`
  height: calc(100vh - 30px);
`;
