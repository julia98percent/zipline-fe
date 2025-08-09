import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { RegionState } from "@ts/region";
import { fetchRegions } from "@apis/regionService";
import { PublicPropertySearchParams } from "@ts/property";
import PublicPropertyFilterModalView from "./PublicPropertyFilterModalView";
import {
  FILTER_DEFAULTS_MIN,
  MAX_PRICE_SLIDER_VALUE,
  MAX_MONTHLY_RENT_SLIDER_VALUE,
  FILTER_DEFAULTS,
} from "@utils/filterUtil";

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
      const convertedFilters = {
        ...filters,
      };
      setLocalFilters(convertedFilters);
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
    const newCategory = event.target.value;

    setLocalFilters((prev) => {
      const updatedFilters = {
        ...prev,
        category: newCategory,
      };

      // 매물 유형이 바뀔 때 불필요한 가격 범위 초기화
      if (newCategory === "SALE") {
        // 매매일 때는 보증금, 월세 초기화
        updatedFilters.minDeposit = undefined;
        updatedFilters.maxDeposit = undefined;
        updatedFilters.minMonthlyRent = undefined;
        updatedFilters.maxMonthlyRent = undefined;
      } else if (newCategory === "DEPOSIT") {
        // 전세일 때는 매매가, 월세 초기화
        updatedFilters.minPrice = undefined;
        updatedFilters.maxPrice = undefined;
        updatedFilters.minMonthlyRent = undefined;
        updatedFilters.maxMonthlyRent = undefined;
      } else if (newCategory === "MONTHLY") {
        // 월세일 때는 매매가 초기화
        updatedFilters.minPrice = undefined;
        updatedFilters.maxPrice = undefined;
      }

      return updatedFilters;
    });
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

  const handleTemporaryClear = () => {
    setLocalFilters((prev) => ({
      ...prev,
      buildingType: "",
      buildingName: "",
      minPrice: FILTER_DEFAULTS_MIN,
      maxPrice: MAX_PRICE_SLIDER_VALUE,
      minDeposit: FILTER_DEFAULTS_MIN,
      maxDeposit: MAX_PRICE_SLIDER_VALUE,
      minMonthlyRent: FILTER_DEFAULTS_MIN,
      maxMonthlyRent: MAX_MONTHLY_RENT_SLIDER_VALUE,
      minNetArea: FILTER_DEFAULTS_MIN,
      maxNetArea: FILTER_DEFAULTS.NET_AREA_MAX,
      minTotalArea: FILTER_DEFAULTS_MIN,
      maxTotalArea: FILTER_DEFAULTS.TOTAL_AREA_MAX,
    }));

    setRegion((prev) => ({
      ...prev,
      selectedSido: null,
      selectedSigungu: null,
      selectedDong: null,
    }));
  };

  const handleReset = () => {
    handleTemporaryClear();
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

    const cleanedFilters = {
      ...localFilters,
      regionCode,
      minPrice:
        localFilters.minPrice === FILTER_DEFAULTS_MIN
          ? undefined
          : localFilters.minPrice,
      maxPrice:
        localFilters.maxPrice === MAX_PRICE_SLIDER_VALUE
          ? undefined
          : localFilters.maxPrice,
      minDeposit:
        localFilters.minDeposit === FILTER_DEFAULTS_MIN
          ? undefined
          : localFilters.minDeposit,
      maxDeposit:
        localFilters.maxDeposit === MAX_PRICE_SLIDER_VALUE
          ? undefined
          : localFilters.maxDeposit,
      minMonthlyRent:
        localFilters.minMonthlyRent === FILTER_DEFAULTS_MIN
          ? undefined
          : localFilters.minMonthlyRent,
      maxMonthlyRent:
        localFilters.maxMonthlyRent === MAX_MONTHLY_RENT_SLIDER_VALUE
          ? undefined
          : localFilters.maxMonthlyRent,
      minNetArea:
        localFilters.minNetArea === FILTER_DEFAULTS_MIN
          ? undefined
          : localFilters.minNetArea,
      maxNetArea:
        localFilters.maxNetArea === FILTER_DEFAULTS.NET_AREA_MAX
          ? undefined
          : localFilters.maxNetArea,
      minTotalArea:
        localFilters.minTotalArea === FILTER_DEFAULTS_MIN
          ? undefined
          : localFilters.minTotalArea,
      maxTotalArea:
        localFilters.maxTotalArea === FILTER_DEFAULTS.TOTAL_AREA_MAX
          ? undefined
          : localFilters.maxTotalArea,
    };

    onApply(cleanedFilters);
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
      onTemporaryClear={handleTemporaryClear}
      onApply={handleApply}
    />
  );
};

export default PublicPropertyFilterModal;
