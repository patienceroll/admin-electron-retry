import { useTheme } from "styled-components";
import { useMemo } from "react";

export default function useTableInnerHeight() {
  const {
    padding,
    margin,
    Pagination = { itemSize: 24, itemSizeSM: 21 },
  } = useTheme();
  const isCompact = window.preload.getTheme().layout === "compact";

  const tableInnerHeight = useMemo(() => {
    const tableBottom = padding;

    // toolbar高度
    const toolbarHeight = 32 + padding * 2;

    // 分页的高度
    const pagenationHeight =
      margin + (!isCompact ? Pagination.itemSize : Pagination.itemSizeSM);

    // thead高度
    const theadHeight = !isCompact ? 48 : 38;

    return tableBottom + toolbarHeight + pagenationHeight + theadHeight;
  }, [Pagination.itemSize, Pagination.itemSizeSM, isCompact, margin, padding]);

  return tableInnerHeight;
}
