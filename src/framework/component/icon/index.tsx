import React, { createElement } from "react";
import { useTheme } from "styled-components";

function Icon(
  props: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  } & React.SVGProps<SVGSVGElement>
) {
  const { icon, ...restProps } = props;
  const theme = useTheme();

  return createElement(
    icon,
    Object.assign(
      {
        width: theme.fontSize,
        height: theme.fontSize,
        fill: theme.colorPrimary,
      } as React.SVGProps<SVGSVGElement>,
      restProps
    )
  );
}

export default Icon;
