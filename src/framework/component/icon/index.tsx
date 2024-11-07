import React from "react";
import { useTheme } from "styled-components";

function Icon(
  props: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  } & React.SVGProps<SVGSVGElement>
) {
  const { icon, ...restProps } = props;
  const theme = useTheme();

  return React.createElement(
    icon,
    Object.assign(
      {
        width: 24,
        height: 24,
        fill: theme.colorPrimary,
      } as React.SVGProps<SVGSVGElement>,
      restProps
    )
  );
}

export default Icon;
