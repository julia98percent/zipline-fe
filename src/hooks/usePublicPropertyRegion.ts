import { useCallback } from "react";
import { SelectChangeEvent } from "@mui/material";

export const usePublicPropertyRegion = (
  selectedSido: string,
  selectedGu: string,
  setParams: (params: Record<string, string | null>) => void
) => {
  const handleSidoChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setParams({
        selectedSido: value || null,
        selectedGu: null,
        selectedDong: null,
        regionCode: value ? value.slice(0, 2) : null,
      });
    },
    [setParams]
  );

  const handleGuChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setParams({
        selectedGu: value || null,
        selectedDong: null,
        regionCode: value
          ? value.slice(0, 5)
          : selectedSido
          ? selectedSido.slice(0, 2)
          : null,
      });
    },
    [setParams, selectedSido]
  );

  const handleDongChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setParams({
        selectedDong: value || null,
        regionCode: value
          ? value.slice(0, 8)
          : selectedGu
          ? selectedGu.slice(0, 5)
          : selectedSido
          ? selectedSido.slice(0, 2)
          : null,
      });
    },
    [setParams, selectedGu, selectedSido]
  );

  return {
    handleSidoChange,
    handleGuChange,
    handleDongChange,
  };
};
