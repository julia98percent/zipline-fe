import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback(
    (key: string, defaultValue: string = ""): string => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  const getBooleanParam = useCallback(
    (key: string, defaultValue: boolean = false): boolean => {
      const value = searchParams.get(key);
      return value ? value === "true" : defaultValue;
    },
    [searchParams]
  );

  const getNumberParam = useCallback(
    (key: string, defaultValue: number = 0): number => {
      const value = searchParams.get(key);
      return value ? parseInt(value, 10) : defaultValue;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | number | boolean) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (!value || value === "" || value === 0) {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
        // 필터 변경 시 첫 페이지로 리셋
        params.delete("page");
        return params;
      });
    },
    [setSearchParams]
  );

  const setParams = useCallback(
    (updates: Record<string, string | number | boolean | null>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (!value || value === "" || value === 0) {
            params.delete(key);
          } else {
            params.set(key, value.toString());
          }
        });

        params.delete("page");
        return params;
      });
    },
    [setSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    getParam,
    getBooleanParam,
    getNumberParam,
    setParam,
    setParams,
    clearAllFilters,
    searchParams,
  };
};
