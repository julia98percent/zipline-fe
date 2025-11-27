import { useCallback } from "react";

export const usePublicPropertySort = (
  getParam: (key: string) => string | null,
  setParams: (params: Record<string, string | boolean | null>) => void
) => {
  const handleSort = useCallback(
    (field: string) => {
      const currentSortField = getParam("sortField") || "id";
      const currentIsAscending = getParam("isAscending") !== "false";

      const newSortField = field;
      let newIsAscending = true;

      if (currentSortField === field) {
        newIsAscending = !currentIsAscending;
      }

      setParams({
        sortField: newSortField,
        isAscending: newIsAscending,
      });
    },
    [getParam, setParams]
  );

  const handleSortReset = useCallback(() => {
    setParams({
      sortField: "id",
      isAscending: true,
    });
  }, [setParams]);

  return {
    handleSort,
    handleSortReset,
  };
};
