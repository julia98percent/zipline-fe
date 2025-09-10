"use client";

import { useCallback } from "react";
import type { Route } from "next";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DEFAULT_ROWS_PER_PAGE } from "@/components/Table/Table";

interface UseUrlPaginationReturn {
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  resetToFirstPage: () => void;
}

export const useUrlPagination = (): UseUrlPaginationReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(0, parseInt(searchParams.get("page") || "0"));
  const rowsPerPage = Math.max(
    1,
    parseInt(searchParams.get("size") || DEFAULT_ROWS_PER_PAGE.toString())
  );

  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage <= 0) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }
      router.push(`${pathname}?${params.toString()}` as Route);
    },
    [searchParams, router, pathname]
  );

  const setRowsPerPage = useCallback(
    (newRowsPerPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newRowsPerPage === DEFAULT_ROWS_PER_PAGE) {
        params.delete("size");
      } else {
        params.set("size", newRowsPerPage.toString());
      }

      params.delete("page");
      router.push(`${pathname}?${params.toString()}` as Route);
    },
    [searchParams, router, pathname]
  );

  const resetToFirstPage = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    router.push(`${pathname}?${params.toString()}` as Route);
  }, [searchParams, router, pathname]);

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    resetToFirstPage,
  };
};
