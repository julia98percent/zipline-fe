import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Region, RegionState } from "@/types/region";
import { fetchRegions } from "@/apis/regionService";
import { PublicPropertySearchParams } from "@/types/property";
import PublicPropertyFilterModalView from "./PublicPropertyFilterModalView";
import {
  FILTER_DEFAULTS_MIN,
  MAX_PRICE_SLIDER_VALUE,
  MAX_MONTHLY_RENT_SLIDER_VALUE,
  FILTER_DEFAULTS,
  PRICE_STEPS,
} from "@/utils/filterUtil";
import { padRegionCode, parseRegionCode } from "@/utils/regionUtil";

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
  const [netAreaRange, setNetAreaRange] = useState<number[]>([
    filters.minNetArea || FILTER_DEFAULTS_MIN,
    filters.maxNetArea || FILTER_DEFAULTS.NET_AREA_MAX,
  ]);

  const [totalAreaRange, setTotalAreaRange] = useState<number[]>([
    filters.minTotalArea || FILTER_DEFAULTS_MIN,
    filters.maxTotalArea || FILTER_DEFAULTS.TOTAL_AREA_MAX,
  ]);

  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice ? Math.round(filters.minPrice) : FILTER_DEFAULTS_MIN,
    filters.maxPrice ? Math.round(filters.maxPrice) : MAX_PRICE_SLIDER_VALUE,
  ]);

  const [depositRange, setDepositRange] = useState<number[]>([
    filters.minDeposit ? Math.round(filters.minDeposit) : FILTER_DEFAULTS_MIN,
    filters.maxDeposit
      ? Math.round(filters.maxDeposit)
      : MAX_PRICE_SLIDER_VALUE,
  ]);

  const [rentRange, setRentRange] = useState<number[]>([
    filters.minMonthlyRent
      ? Math.round(filters.minMonthlyRent)
      : FILTER_DEFAULTS_MIN,
    filters.maxMonthlyRent
      ? Math.round(filters.maxMonthlyRent)
      : MAX_MONTHLY_RENT_SLIDER_VALUE,
  ]);

  const [selectedType, setSelectedType] = useState<string>(
    filters.category || ""
  );
  const [buildingType, setBuildingType] = useState<string>(
    filters.buildingType || ""
  );
  const [buildingName, setBuildingName] = useState<string>(
    filters.buildingName || ""
  );
  const regionCodeForSelect = filters.regionCode
    ? padRegionCode(filters.regionCode)
    : "";
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido:
      (filters.regionCode &&
        parseRegionCode(String(regionCodeForSelect)).sidoCode) ||
      null,
    selectedSigungu:
      (filters.regionCode &&
        parseRegionCode(String(regionCodeForSelect)).sigunguCode) ||
      null,
    selectedDong:
      (filters.regionCode &&
        parseRegionCode(String(regionCodeForSelect)).dongCode) ||
      null,
  });

  const [isInitializing, setIsInitializing] = useState(false);

  const getPriceStep = ({
    isMonthlyRent = false,
    value,
  }: {
    isMonthlyRent?: boolean;
    value: number;
  }) => {
    if (isMonthlyRent) {
      if (value <= PRICE_STEPS.MONTHLY_RENT.LOW_THRESHOLD)
        return PRICE_STEPS.MONTHLY_RENT.LOW_STEP;
      return PRICE_STEPS.MONTHLY_RENT.HIGH_STEP;
    }
    if (value <= PRICE_STEPS.GENERAL.LEVEL1_THRESHOLD)
      return PRICE_STEPS.GENERAL.LEVEL1_STEP;
    if (value <= PRICE_STEPS.GENERAL.LEVEL2_THRESHOLD)
      return PRICE_STEPS.GENERAL.LEVEL2_STEP;
    if (value <= PRICE_STEPS.GENERAL.LEVEL3_THRESHOLD)
      return PRICE_STEPS.GENERAL.LEVEL3_STEP;
    return PRICE_STEPS.GENERAL.LEVEL4_STEP;
  };

  const handlePriceRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;
    const minStep = getPriceStep({ value: min });
    const maxStep = getPriceStep({ value: max });

    const adjustedMin = Math.round(min / minStep) * minStep;
    const adjustedMax = Math.round(max / maxStep) * maxStep;

    setPriceRange([adjustedMin, adjustedMax]);
  };

  const handleDepositRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;
    const minStep = getPriceStep({ value: min });
    const maxStep = getPriceStep({ value: max });

    const adjustedMin = Math.round(min / minStep) * minStep;
    const adjustedMax = Math.round(max / maxStep) * maxStep;

    setDepositRange([adjustedMin, adjustedMax]);
  };

  const handleRentRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;
    const minStep = getPriceStep({ isMonthlyRent: true, value: min });
    const maxStep = getPriceStep({ isMonthlyRent: true, value: max });

    const adjustedMin = Math.round(min / minStep) * minStep;
    const adjustedMax = Math.round(max / maxStep) * maxStep;

    setRentRange([adjustedMin, adjustedMax]);
  };

  const handleNetAreaRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;

    setNetAreaRange([min, max]);
  };

  const handleTotalAreaRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;

    setTotalAreaRange([min, max]);
  };

  const handleOpen = async () => {
    setIsInitializing(true);
    try {
      const sidoData = await fetchRegions(0);

      if (filters.regionCode) {
        const { sidoCode, sigunguCode, dongCode } = parseRegionCode(
          filters.regionCode
        );

        if (sidoCode) {
          const sigunguData = await fetchRegions(sidoCode);

          let dongData: Region[] = [];
          if (sigunguCode) {
            dongData = await fetchRegions(sigunguCode);
          }

          setRegion({
            sido: sidoData,
            sigungu: sigunguData,
            dong: dongData,
            selectedSido: sidoCode,
            selectedSigungu: sigunguCode || null,
            selectedDong: dongCode || null,
          });
        } else {
          setRegion((prev) => ({
            ...prev,
            sido: sidoData,
            sigungu: [],
            dong: [],
            selectedSido: null,
            selectedSigungu: null,
            selectedDong: null,
          }));
        }
      } else {
        setRegion((prev) => ({
          ...prev,
          sido: sidoData,
          sigungu: [],
          dong: [],
          selectedSido: null,
          selectedSigungu: null,
          selectedDong: null,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch region data:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (open) {
      handleOpen();
    }
  }, [open]);

  useEffect(() => {
    if (!region.selectedSido || isInitializing) return;

    const loadSigungu = async () => {
      try {
        const sigunguData = await fetchRegions(region.selectedSido!);
        setRegion((prev) => ({
          ...prev,
          sigungu: sigunguData,
          selectedSigungu: prev.selectedSigungu,
          selectedDong: prev.selectedDong,
          dong: prev.dong,
        }));
      } catch (error) {
        console.error("Failed to fetch sigungu data:", error);
      }
    };

    loadSigungu();
  }, [region.selectedSido, isInitializing]);

  useEffect(() => {
    if (!region.selectedSigungu || isInitializing) return;

    const loadDong = async () => {
      try {
        const dongData = await fetchRegions(region.selectedSigungu!);
        setRegion((prev) => ({
          ...prev,
          dong: dongData,
          selectedDong: prev.selectedDong,
        }));
      } catch (error) {
        console.error("Failed to fetch dong data:", error);
      }
    };

    loadDong();
  }, [region.selectedSigungu, isInitializing]);

  const handleSidoChange = (event: SelectChangeEvent<number>) => {
    const selectedRegion = region.sido.find(
      (item) => item.cortarNo == event.target.value
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

  const handleGuChange = (event: SelectChangeEvent<number>) => {
    const selectedRegion = region.sigungu.find(
      (item) => item.cortarNo == event.target.value
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

  const handleDongChange = (event: SelectChangeEvent<number>) => {
    const selectedRegion = region.dong.find(
      (item) => item.cortarNo == event.target.value
    );
    if (selectedRegion) {
      setRegion((prev) => ({
        ...prev,
        selectedDong: selectedRegion.cortarNo,
      }));
    }
  };

  const handleCategoryChange: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    const newType = event.currentTarget.value;

    setSelectedType(newType);

    if (newType === "SALE") {
      setDepositRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.DEPOSIT_MAX]);
      setRentRange([FILTER_DEFAULTS_MIN, MAX_MONTHLY_RENT_SLIDER_VALUE]);
    } else if (newType === "DEPOSIT") {
      setPriceRange([FILTER_DEFAULTS_MIN, MAX_PRICE_SLIDER_VALUE]);
      setRentRange([FILTER_DEFAULTS_MIN, MAX_MONTHLY_RENT_SLIDER_VALUE]);
    } else if (newType === "MONTHLY") {
      setPriceRange([FILTER_DEFAULTS_MIN, MAX_PRICE_SLIDER_VALUE]);
    }
  };

  const handleBuildingTypeChange = (event: SelectChangeEvent<string>) => {
    setBuildingType(event.target.value);
  };

  const handleBuildingNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBuildingName(event.target.value);
  };

  const handleTemporaryClear = () => {
    setBuildingName("");
    setBuildingType("");
    setSelectedType("");
    setNetAreaRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.NET_AREA_MAX]);
    setTotalAreaRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.TOTAL_AREA_MAX]);
    setPriceRange([FILTER_DEFAULTS_MIN, MAX_PRICE_SLIDER_VALUE]);
    setDepositRange([FILTER_DEFAULTS_MIN, MAX_PRICE_SLIDER_VALUE]);
    setRentRange([FILTER_DEFAULTS_MIN, MAX_MONTHLY_RENT_SLIDER_VALUE]);

    setRegion((prev) => ({
      ...prev,
      selectedSido: null,
      selectedSigungu: null,
      selectedDong: null,
    }));
  };

  const handleApply = () => {
    const cleanedFilters: Partial<PublicPropertySearchParams> = {};

    let regionCode: string | undefined;
    if (region.selectedDong) {
      regionCode = String(region.selectedDong);
    } else if (region.selectedSigungu) {
      regionCode = String(region.selectedSigungu).slice(0, 5);
    } else if (region.selectedSido) {
      regionCode = String(region.selectedSido).slice(0, 2);
    }

    if (regionCode) {
      cleanedFilters.regionCode = regionCode;
    }

    if (buildingName) {
      cleanedFilters.buildingName = buildingName;
    }
    if (buildingType) {
      cleanedFilters.buildingType = buildingType;
    }

    if (
      netAreaRange[0] > FILTER_DEFAULTS_MIN ||
      netAreaRange[1] < FILTER_DEFAULTS.NET_AREA_MAX
    ) {
      cleanedFilters.minNetArea = netAreaRange[0];
      cleanedFilters.maxNetArea = netAreaRange[1];
    } else {
      cleanedFilters.minNetArea = undefined;
      cleanedFilters.maxNetArea = undefined;
    }

    if (
      totalAreaRange[0] > FILTER_DEFAULTS_MIN ||
      totalAreaRange[1] < FILTER_DEFAULTS.TOTAL_AREA_MAX
    ) {
      cleanedFilters.minTotalArea = totalAreaRange[0];
      cleanedFilters.maxTotalArea = totalAreaRange[1];
    } else {
      cleanedFilters.minTotalArea = undefined;
      cleanedFilters.maxTotalArea = undefined;
    }

    cleanedFilters.minPrice = priceRange[0] > 0 ? priceRange[0] : undefined;
    cleanedFilters.maxPrice =
      priceRange[1] > FILTER_DEFAULTS.PRICE_MAX ? undefined : priceRange[1];

    cleanedFilters.minDeposit =
      depositRange[0] > 0 ? depositRange[0] : undefined;
    cleanedFilters.maxDeposit =
      depositRange[1] > FILTER_DEFAULTS.DEPOSIT_MAX
        ? undefined
        : depositRange[1];

    cleanedFilters.minMonthlyRent = rentRange[0] > 0 ? rentRange[0] : undefined;
    cleanedFilters.maxMonthlyRent =
      rentRange[1] > FILTER_DEFAULTS.MONTHLY_RENT_MAX
        ? undefined
        : rentRange[1];

    cleanedFilters.category = selectedType || undefined;

    onApply(cleanedFilters);
    onClose();
  };

  return (
    <PublicPropertyFilterModalView
      open={open}
      onClose={onClose}
      netAreaRange={netAreaRange}
      totalAreaRange={totalAreaRange}
      priceRange={priceRange}
      depositRange={depositRange}
      rentRange={rentRange}
      handlePriceRangeChange={handlePriceRangeChange}
      handleDepositRangeChange={handleDepositRangeChange}
      handleRentRangeChange={handleRentRangeChange}
      handleNetAreaRangeChange={handleNetAreaRangeChange}
      handleTotalAreaRangeChange={handleTotalAreaRangeChange}
      selectedType={selectedType}
      buildingType={buildingType}
      buildingName={buildingName}
      region={region}
      onSidoChange={handleSidoChange}
      onGuChange={handleGuChange}
      onDongChange={handleDongChange}
      onCategoryChange={handleCategoryChange}
      onBuildingTypeChange={handleBuildingTypeChange}
      onBuildingNameChange={handleBuildingNameChange}
      onTemporaryClear={handleTemporaryClear}
      onApply={handleApply}
    />
  );
};

export default PublicPropertyFilterModal;
