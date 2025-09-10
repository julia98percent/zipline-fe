"use client";

import { useCallback } from "react";
import type { Route } from "next";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const useUrlFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }

      params.delete("page");
      router.push(`${pathname}?${params.toString()}` as Route);
    },
    [searchParams, router, pathname]
  );

  const setParams = useCallback(
    (updates: Record<string, string | number | boolean | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === 0
        ) {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });

      params.delete("page");
      router.push(`${pathname}?${params.toString()}` as Route);
    },
    [searchParams, router, pathname]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname as Route);
  }, [router, pathname]);

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
