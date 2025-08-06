import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";

interface UseUrlPaginationReturn {
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  resetToFirstPage: () => void;
}

export const useUrlPagination = (): UseUrlPaginationReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(0, parseInt(searchParams.get("page") || "0"));
  const rowsPerPage = Math.max(
    1,
    parseInt(searchParams.get("size") || DEFAULT_ROWS_PER_PAGE.toString())
  );

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (newPage <= 0) {
          params.delete("page");
        } else {
          params.set("page", newPage.toString());
        }
        return params;
      });
    },
    [setSearchParams]
  );

  const setRowsPerPage = useCallback(
    (newRowsPerPage: number) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (newRowsPerPage === DEFAULT_ROWS_PER_PAGE) {
          params.delete("size");
        } else {
          params.set("size", newRowsPerPage.toString());
        }

        params.delete("page");
        return params;
      });
    },
    [setSearchParams]
  );

  const resetToFirstPage = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("page");
      return params;
    });
  }, [setSearchParams]);

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    resetToFirstPage,
  };
};
