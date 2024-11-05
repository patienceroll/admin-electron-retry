import { useCallback, useState } from "react";

export default function () {
  const [, setCount] = useState(0);

  const update = useCallback(() => {
    setCount((t) => {
      if (t < Number.MAX_SAFE_INTEGER) {
        return t + 1;
      }
      return 0;
    });
  }, []);

  return [update];
}
