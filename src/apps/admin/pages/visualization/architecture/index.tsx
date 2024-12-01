import styled, { useTheme } from "styled-components";
import React, { useEffect } from "react";

import * as chart from "src/framework/component/chart";
import PageWrapper from "src/framework/component/page-wrapper";
import useOption from "src/hooks/use-option";
import { getDepartmentOption } from "src/apps/admin/api/department";

type DepartmentTreeItem = DepartmentListItem & {
  children?: DepartmentTreeItem[];
};

function ListToTree(params: DepartmentListItem[]) {
  function deal(
    data: DepartmentListItem[],
    id: DepartmentListItem["id"]
  ): DepartmentTreeItem[] {
    return data
      .filter((i) => i.pid === id)
      .map((item) => ({
        ...item,
        children: deal(data, item.id),
      }));
  }
  return deal(params, 0);
}

function Architecture(props: StyledWrapComponents) {
  const { className } = props;
  const theme = useTheme();
  const ref = chart.createRef();
  const [departmentList] = useOption(getDepartmentOption);

  async function load() {
    const instance = await ref.current?.getInstance();
    if (instance) {
      instance.showLoading({ color: theme.colorPrimary, text: "加载中..." });
      const data = await departmentList.loadOption();
      const tree = ListToTree(data);

      instance.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        calculable: false,
        series: [
          {
            type: "tree",
            data: tree,
            left: "2%",
            right: "2%",
            top: "8%",
            bottom: "20%",
            expandAndCollapse: false,
            animationDurationUpdate: 750,
            edgeShape: "polyline",
            orient: "vertical",
            label: {
              width: 100,
              fontSize: 14,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: "#fff",
              backgroundColor: "#eee",
              rich: {
                name: { color: "#eee", align: "center" },
                label: {
                  width: 50,
                  height: 25,
                  padding: [0, 0, 0, 8],
                  align: "left",
                  backgroundColor: "#efefef",
                },
                content: {
                  width: 50,
                  height: 25,
                  padding: [0, 8, 0, 0],
                  align: "right",
                },
                nameBg: {
                  backgroundColor: "#333",
                  width: "100%",
                  align: "right",
                  height: 25,
                  borderRadius: [4, 4, 0, 0],
                },
              },
              formatter(item: { data: DepartmentTreeItem }) {
                return [
                  `{name|${item.data.name}}{nameBg|}`,
                  `{label|负责人}{content|${item.data.staff?.name || "-"}}`,
                  `{label|职位}{content|${item.data.job_count || 0}}`,
                  `{label|职员}{content|${item.data.employee_count || 0}}`,
                ].join("\n");
              },
            },
            rootLocation: { x: "50%", y: "10%" },
          },
        ],
      });
      instance.hideLoading();
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <PageWrapper className={className}>
      <chart.default ref={ref} className="chart" />
    </PageWrapper>
  );
}

export default styled(Architecture)`
  .chart {
    height: calc(100vh - ${(props) => props.theme.padding * 2}px);
  }
`;
