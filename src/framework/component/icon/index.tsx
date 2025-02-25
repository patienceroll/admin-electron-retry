import React, { createElement, useMemo } from "react";
import { useTheme } from "styled-components";

function Icon(
  props: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  } & React.SVGProps<SVGSVGElement>
) {
  const { icon, ...restProps } = props;
  const theme = useTheme();

  const width = useMemo(() => {
    if (restProps.width === undefined) return `${theme.fontSize}px`;
    if (typeof restProps.width === "number") return `${restProps.width}px`;
    return restProps.width;
  }, [restProps.width, theme.fontSize]);

  const height = useMemo(() => {
    if (restProps.height === undefined) return `${theme.fontSize}px`;
    if (typeof restProps.height === "number") return `${restProps.height}px`;
    return restProps.height;
  }, [restProps.height, theme.fontSize]);

  return createElement(
    icon,
    Object.assign<React.SVGProps<SVGSVGElement>, React.SVGProps<SVGSVGElement>>(
      {
        fill: theme.colorPrimary,
      },
      { ...restProps, width,height }
    )
  );
}

export default Icon;
