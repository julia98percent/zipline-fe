import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { RegionState } from "@ts/region";
import { fetchRegions } from "@apis/regionService";
import { PublicPropertySearchParams } from "@ts/property";
import PublicPropertyFilterModalView from "./PublicPropertyFilterModalView";

interface PublicPropertyFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Partial<PublicPropertySearchParams>) => void;
  filters: PublicPropertySearchParams;
  selectedSido: string;
  selectedGu: string;
  selectedDong: string;
  onSidoChange: (event: SelectChangeEvent<string>) => void;
  onGuChange: (event: SelectChangeEvent<string>) => void;
  onDongChange: (event: SelectChangeEvent<string>) => void;
}

const PublicPropertyFilterModal = ({
  open,
  onClose,
  onApply,
  filters,
}: PublicPropertyFilterModalProps) => {
  const [localFilters, setLocalFilters] =
    useState<PublicPropertySearchParams>(filters);
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });

  // Load initial region data when modal opens
  const handleOpen = async () => {
    try {
      const sidoData = await fetchRegions(0);
      setRegion((prev) => ({ ...prev, sido: sidoData }));
    } catch (error) {
      console.error("Failed to fetch sido data:", error);
    }
  };

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      handleOpen();
    }
  }, [open, filters]);

  // Load sigungu when sido is selected
  useEffect(() => {
    if (!region.selectedSido) return;

    const loadSigungu = async () => {
      try {
        const sigunguData = await fetchRegions(region.selectedSido!);
        setRegion((prev) => ({
          ...prev,
          sigungu: sigunguData,
          selectedSigungu: null,
          selectedDong: null,
          dong: [],
        }));
      } catch (error) {
        console.error("Failed to fetch sigungu data:", error);
      }
    };

    loadSigungu();
  }, [region.selectedSido]);

  useEffect(() => {
    if (!region.selectedSigungu) return;

    const loadDong = async () => {
      try {
        const dongData = await fetchRegions(region.selectedSigungu!);
        setRegion((prev) => ({
          ...prev,
          dong: dongData,
          selectedDong: null,
        }));
      } catch (error) {
        console.error("Failed to fetch dong data:", error);
      }
    };

    loadDong();
  }, [region.selectedSigungu]);

  const handleSidoChange = (event: SelectChangeEvent<string>) => {
    const selectedRegion = region.sido.find(
      (item) => String(item.cortarNo) === event.target.value
    );
    if (selectedRegion) {
      setRegion((prev) => ({
        ...prev,
        selectedSido: selectedRegion.cortarNo,
        selectedSigungu: null,
        selectedDong: null,
        sigungu: [],
        dong: [],
      }));
    }
  };

  const handleGuChange = (event: SelectChangeEvent<string>) => {
    const selectedRegion = region.sigungu.find(
      (item) => String(item.cortarNo) === event.target.value
    );
    if (selectedRegion) {
      setRegion((prev) => ({
        ...prev,
        selectedSigungu: selectedRegion.cortarNo,
        selectedDong: null,
        dong: [],
      }));
    }
  };

  const handleDongChange = (event: SelectChangeEvent<string>) => {
    const selectedRegion = region.dong.find(
      (item) => String(item.cortarNo) == event.target.value
    );
    if (selectedRegion) {
      setRegion((prev) => ({
        ...prev,
        selectedDong: selectedRegion.cortarNo,
      }));
    }
  };

  const handleSliderChange =
    (field: string) => (_: Event, newValue: number | number[]) => {
      const [min, max] = newValue as number[];
      setLocalFilters((prev) => ({
        ...prev,
        [`min${field}`]: min,
        [`max${field}`]: max,
      }));
    };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters((prev) => ({
      ...prev,
      category: event.target.value,
    }));
  };

  const handleBuildingTypeChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters((prev) => ({
      ...prev,
      buildingType: event.target.value,
    }));
  };

  const handleBuildingNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      buildingName: event.target.value,
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      page: 0,
      size: 20,
      sortFields: { id: "ASC" },
      category: "",
      buildingType: "",
      buildingName: "",
      minPrice: undefined,
      maxPrice: undefined,
      minDeposit: undefined,
      maxDeposit: undefined,
      minMonthlyRent: undefined,
      maxMonthlyRent: undefined,
      minNetArea: undefined,
      maxNetArea: undefined,
      minTotalArea: undefined,
      maxTotalArea: undefined,
    });
    setRegion((prev) => ({
      ...prev,
      selectedSido: null,
      selectedSigungu: null,
      selectedDong: null,
    }));
    onApply({});
  };

  const handleApply = () => {
    let regionCode: string | undefined;
    if (region.selectedDong) {
      regionCode = String(region.selectedDong);
    } else if (region.selectedSigungu) {
      regionCode = String(region.selectedSigungu).slice(0, 5);
    } else if (region.selectedSido) {
      regionCode = String(region.selectedSido).slice(0, 2);
    }

    const updatedFilters = {
      ...localFilters,
      regionCode,
    };
    onApply(updatedFilters);
    onClose();
  };

  return (
    <PublicPropertyFilterModalView
      open={open}
      onClose={onClose}
      localFilters={localFilters}
      region={region}
      onSidoChange={handleSidoChange}
      onGuChange={handleGuChange}
      onDongChange={handleDongChange}
      onSliderChange={handleSliderChange}
      onCategoryChange={handleCategoryChange}
      onBuildingTypeChange={handleBuildingTypeChange}
      onBuildingNameChange={handleBuildingNameChange}
      onReset={handleReset}
      onApply={handleApply}
    />
  );
};

export default PublicPropertyFilterModal;
