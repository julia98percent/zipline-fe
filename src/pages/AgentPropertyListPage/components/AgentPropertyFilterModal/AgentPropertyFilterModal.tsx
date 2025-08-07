import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { AgentPropertySearchParams } from "@apis/propertyService";
import AgentPropertyFilterModalView from "./AgentPropertyFilterModalView";

interface AgentPropertyFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Partial<AgentPropertySearchParams>) => void;
  filters: AgentPropertySearchParams;
  regions: unknown[];
  selectedSido: string;
  selectedGu: string;
  selectedDong: string;
  typeOptions: TypeOption[];
  onSidoChange: (event: SelectChangeEvent<number>) => void;
  onGuChange: (event: SelectChangeEvent<number>) => void;
  onDongChange: (event: SelectChangeEvent<number>) => void;
  onTypeChange: (event: SelectChangeEvent<unknown>) => void;
}

const AgentPropertyFilterModal = ({
  open,
  onClose,
  onApply,
  filters,
  typeOptions,
  onTypeChange,
}: AgentPropertyFilterModalProps) => {
  const [hasElevator, setHasElevator] = useState<string>(
    filters.hasElevator === true
      ? "true"
      : filters.hasElevator === false
      ? "false"
      : "all"
  );
  const [petsAllowed, setPetsAllowed] = useState<string>(
    filters.petsAllowed === true
      ? "true"
      : filters.petsAllowed === false
      ? "false"
      : "all"
  );

  // 면적 범위 (전용 면적)
  const [netAreaRange, setNetAreaRange] = useState<number[]>([
    filters.minNetArea || 0,
    filters.maxNetArea || 200,
  ]);

  // 면적 범위 (공급 면적)
  const [totalAreaRange, setTotalAreaRange] = useState<number[]>([
    filters.minTotalArea || 0,
    filters.maxTotalArea || 300,
  ]);

  // 가격 범위 (매매가)
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || 0,
    filters.maxPrice || 100000,
  ]);

  // 가격 범위 (보증금)
  const [depositRange, setDepositRange] = useState<number[]>([
    filters.minDeposit || 0,
    filters.maxDeposit || 50000,
  ]);

  // filters prop이 변경될 때마다 상태 업데이트
  useEffect(() => {
    setHasElevator(
      filters.hasElevator === true
        ? "true"
        : filters.hasElevator === false
        ? "false"
        : "all"
    );
    setPetsAllowed(
      filters.petsAllowed === true
        ? "true"
        : filters.petsAllowed === false
        ? "false"
        : "all"
    );
    setNetAreaRange([filters.minNetArea || 0, filters.maxNetArea || 200]);
    setTotalAreaRange([filters.minTotalArea || 0, filters.maxTotalArea || 300]);
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 100000]);
    setDepositRange([filters.minDeposit || 0, filters.maxDeposit || 50000]);
    setSelectedType(filters.type || "");
  }, [filters]);

  const handleApply = () => {
    const cleanedFilters: Partial<AgentPropertySearchParams> = {};

    // Boolean 필터들
    if (hasElevator === "true") {
      cleanedFilters.hasElevator = true;
    } else if (hasElevator === "false") {
      cleanedFilters.hasElevator = false;
    } else {
      cleanedFilters.hasElevator = undefined;
    }

    if (petsAllowed === "true") {
      cleanedFilters.petsAllowed = true;
    } else if (petsAllowed === "false") {
      cleanedFilters.petsAllowed = false;
    } else {
      cleanedFilters.petsAllowed = undefined;
    }

    if (netAreaRange[0] > 0 || netAreaRange[1] < 200) {
      cleanedFilters.minNetArea = netAreaRange[0];
      cleanedFilters.maxNetArea = netAreaRange[1];
    } else {
      cleanedFilters.minNetArea = undefined;
      cleanedFilters.maxNetArea = undefined;
    }

    if (totalAreaRange[0] > 0 || totalAreaRange[1] < 300) {
      cleanedFilters.minTotalArea = totalAreaRange[0];
      cleanedFilters.maxTotalArea = totalAreaRange[1];
    } else {
      cleanedFilters.minTotalArea = undefined;
      cleanedFilters.maxTotalArea = undefined;
    }

    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      cleanedFilters.minPrice = priceRange[0];
      cleanedFilters.maxPrice = priceRange[1];
    } else {
      cleanedFilters.minPrice = undefined;
      cleanedFilters.maxPrice = undefined;
    }

    if (depositRange[0] > 0 || depositRange[1] < 50000) {
      cleanedFilters.minDeposit = depositRange[0];
      cleanedFilters.maxDeposit = depositRange[1];
    } else {
      cleanedFilters.minDeposit = undefined;
      cleanedFilters.maxDeposit = undefined;
    }

    if (selectedType) {
      cleanedFilters.type = selectedType as any;
    } else {
      cleanedFilters.type = undefined;
    }

    onApply(cleanedFilters);
    onClose();
  };

  const handleReset = () => {
    setHasElevator("all");
    setPetsAllowed("all");
    setNetAreaRange([0, 200]);
    setTotalAreaRange([0, 300]);
    setPriceRange([0, 100000]);
    setDepositRange([0, 50000]);
    setSelectedType("");
  };

  const formatPrice = (value: number, isMaxValue?: boolean) => {
    let formatted = "";
    if (value >= 10000) {
      formatted = `${(value / 10000).toFixed(0)}억원`;
    } else if (value >= 1000) {
      formatted = `${(value / 1000).toFixed(0)}천만원`;
    } else {
      formatted = `${value}만원`;
    }

    if (isMaxValue) {
      formatted += "~";
    }

    return formatted;
  };

  const formatPriceForSlider = (value: number, max?: number) => {
    let formatted = "";
    if (value >= 10000) {
      formatted = `${(value / 10000).toFixed(0)}억원`;
    } else if (value >= 1000) {
      formatted = `${(value / 1000).toFixed(0)}천만원`;
    } else {
      formatted = `${value}만원`;
    }

    if (max && value === max) {
      formatted += "~";
    }

    return formatted;
  };

  const getPriceStep = (value: number) => {
    if (value <= 1000) return 100; // 1천만원까지는 100만원 단위
    if (value <= 5000) return 500; // 5천만원까지는 500만원 단위
    if (value <= 10000) return 1000; // 1억까지는 1천만원 단위
    return 5000; // 1억 이후는 5천만원 단위
  };

  const handlePriceRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;
    const minStep = getPriceStep(min);
    const maxStep = getPriceStep(max);

    const adjustedMin = Math.round(min / minStep) * minStep;
    const adjustedMax = Math.round(max / maxStep) * maxStep;

    setPriceRange([adjustedMin, adjustedMax]);
  };

  const handleDepositRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;
    const minStep = getPriceStep(min);
    const maxStep = getPriceStep(max);

    const adjustedMin = Math.round(min / minStep) * minStep;
    const adjustedMax = Math.round(max / maxStep) * maxStep;

    setDepositRange([adjustedMin, adjustedMax]);
  };

  const handleClose = () => {
    setHasElevator(
      filters.hasElevator === true
        ? "true"
        : filters.hasElevator === false
        ? "false"
        : "all"
    );
    setPetsAllowed(
      filters.petsAllowed === true
        ? "true"
        : filters.petsAllowed === false
        ? "false"
        : "all"
    );
    setNetAreaRange([filters.minNetArea || 0, filters.maxNetArea || 200]);
    setTotalAreaRange([filters.minTotalArea || 0, filters.maxTotalArea || 300]);
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 100000]);
    setDepositRange([filters.minDeposit || 0, filters.maxDeposit || 50000]);
    setSelectedType(filters.type || "");
    onClose();
  };

  return (
    <AgentPropertyFilterModalView
      open={open}
      onClose={handleClose}
      onApply={handleApply}
      onReset={handleReset}
      hasElevator={hasElevator}
      petsAllowed={petsAllowed}
      netAreaRange={netAreaRange}
      totalAreaRange={totalAreaRange}
      priceRange={priceRange}
      depositRange={depositRange}
      setHasElevator={setHasElevator}
      setPetsAllowed={setPetsAllowed}
      setNetAreaRange={setNetAreaRange}
      setTotalAreaRange={setTotalAreaRange}
      handlePriceRangeChange={handlePriceRangeChange}
      handleDepositRangeChange={handleDepositRangeChange}
      formatPrice={formatPrice}
      formatPriceForSlider={formatPriceForSlider}
      selectedType={selectedType}
      typeOptions={typeOptions}
      onTypeChange={setSelectedType}
    />
  );
};

export default AgentPropertyFilterModal;
