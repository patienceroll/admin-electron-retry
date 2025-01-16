import { useTheme } from "styled-components";
import { useMemo } from "react";

export default function useTableInnerHeight(
  options: {
    toolbar?: boolean;
    pagenation?: boolean;
    /** 选择栏 */
    alert?: boolean;
  } = {}
) {
  const { toolbar = true, pagenation = true, alert = false } = options;
  const theme = useTheme();
  const {
    padding,
    margin,
    Pagination = { itemSize: 24, itemSizeSM: 21 },
  } = theme;
  const isCompact = window.preload.getTheme().layout === "compact";

  const tableInnerHeight = useMemo(() => {
    // thead高度
    const theadHeight = !isCompact ? 48 : 38;

    // unknown height  // 不知道为啥滚动容器会多一像素
    const unknownHeight = 1;

    // 分页的高度
    let pagenationHeight = 0;
    if (pagenation) {
      pagenationHeight =
        margin + (!isCompact ? Pagination.itemSize : Pagination.itemSizeSM);
    }
    // 底部padding
    let tableBottom = 0;
    // toolbar高度
    let toolbarHeight = 0;
    if (toolbar) {
      toolbarHeight = 32 + (isCompact ? 4 : 12) * 2;
      tableBottom = padding;
    }

    // alert 高度
    let alertHeight = 0;
    if (alert) {
      alertHeight = (isCompact ? 36 : 46) + margin;
    }

    return (
      unknownHeight +
      tableBottom +
      toolbarHeight +
      pagenationHeight +
      theadHeight +
      alertHeight
    );
  }, [
    Pagination.itemSize,
    Pagination.itemSizeSM,
    alert,
    isCompact,
    margin,
    padding,
    pagenation,
    toolbar,
  ]);

  return tableInnerHeight;
}
