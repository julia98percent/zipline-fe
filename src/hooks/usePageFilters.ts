import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

const usePageFilters = <T>(storageKey: string, initialFilters: T) => {
  const location = useLocation();

  const [storedData] = useState(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) return initialFilters;

      const data = JSON.parse(stored);
      if (data.currentPath !== location.pathname) {
        sessionStorage.removeItem(storageKey);
        return initialFilters;
      }

      return data.filters || initialFilters;
    } catch {
      return initialFilters;
    }
  });

  const saveFilters = useCallback(
    (filters: T) => {
      const dataToStore = {
        currentPath: location.pathname,
        filters,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(dataToStore));
    },
    [location.pathname, storageKey]
  );

  return { storedData, saveFilters };
};

export default usePageFilters;
