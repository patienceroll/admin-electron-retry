import useOption from "src/hooks/use-option";
import { useMemo } from "react";

import { staffTreeOptions } from "src/apps/admin/api/staff";
import key from "src/util/key";

type OptionsUseForTreeSelect = {
  title?: React.ReactNode;
  value?: string | number;
  children?: OptionsUseForTreeSelect[];
  selectable?: boolean;
};

export default function () {
  const [options] = useOption(staffTreeOptions);

  const treeOptions = useMemo(() => {
    function recusion(data: StaffTreeOption[]): OptionsUseForTreeSelect[] {
      return data.map((item) => {
        const children: OptionsUseForTreeSelect[] = [];
        if (item.employee instanceof Array) {
          item.employee.forEach((emp) => {
            children.push({ title: emp.name, value: emp.id });
          });
        }

        const childPartment = recusion(item.child || []);

        return {
          title: item.name,
          value: key.randomString(),
          selectable: false,
          disabled: true,
          children: children.concat(childPartment),
        };
      });
    }

    return recusion(options.list);
  }, [options.list]);

  return {
    options,
    treeOptions,
  };
}
