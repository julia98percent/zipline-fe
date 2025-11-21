"use client";

import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { AgentPropertySearchParams } from "@/apis/propertyService";
import AgentPropertyFilterModalView from "./AgentPropertyFilterModalView";
import { PropertyType } from "@/types/property";
import {
  FILTER_DEFAULTS_MIN,
  FILTER_DEFAULTS,
  PRICE_STEPS,
  MAX_PRICE_SLIDER_VALUE,
  MAX_MONTHLY_RENT_SLIDER_VALUE,
} from "@/utils/filterUtil";

interface TypeOption {
  value: string;
  label: string;
}

interface AgentPropertyFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Partial<AgentPropertySearchParams>) => void;
  filters: AgentPropertySearchParams;
  typeOptions: TypeOption[];
}

const AgentPropertyFilterModal = ({
  open,
  onClose,
  onApply,
  filters,
  typeOptions,
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

  const [netAreaRange, setNetAreaRange] = useState<number[]>([
    filters.minNetArea || FILTER_DEFAULTS_MIN,
    filters.maxNetArea || FILTER_DEFAULTS.NET_AREA_MAX,
  ]);

  const [totalAreaRange, setTotalAreaRange] = useState<number[]>([
    filters.minTotalArea || FILTER_DEFAULTS_MIN,
    filters.maxTotalArea || FILTER_DEFAULTS.TOTAL_AREA_MAX,
  ]);

  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice
      ? Math.round(filters.minPrice / 1000)
      : FILTER_DEFAULTS_MIN,
    filters.maxPrice
      ? Math.round(filters.maxPrice / 1000)
      : FILTER_DEFAULTS.PRICE_MAX,
  ]);

  const [depositRange, setDepositRange] = useState<number[]>([
    filters.minDeposit
      ? Math.round(filters.minDeposit / 1000)
      : FILTER_DEFAULTS_MIN,
    filters.maxDeposit
      ? Math.round(filters.maxDeposit / 1000)
      : FILTER_DEFAULTS.DEPOSIT_MAX,
  ]);

  const [rentRange, setRentRange] = useState<number[]>([
    filters.minRent ? Math.round(filters.minRent / 1000) : FILTER_DEFAULTS_MIN,
    filters.maxRent
      ? Math.round(filters.maxRent / 1000)
      : FILTER_DEFAULTS.MONTHLY_RENT_MAX,
  ]);

  const [selectedType, setSelectedType] = useState<string>(filters.type || "");

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);

    if (newType === "SALE") {
      setDepositRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.DEPOSIT_MAX]);
      setRentRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.MONTHLY_RENT_MAX]);
    } else if (newType === "DEPOSIT") {
      setPriceRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.PRICE_MAX]);
      setRentRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.MONTHLY_RENT_MAX]);
    } else if (newType === "MONTHLY") {
      setPriceRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.PRICE_MAX]);
    }
  };

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
    setNetAreaRange([
      filters.minNetArea || FILTER_DEFAULTS_MIN,
      filters.maxNetArea || FILTER_DEFAULTS.NET_AREA_MAX,
    ]);
    setTotalAreaRange([
      filters.minTotalArea || FILTER_DEFAULTS_MIN,
      filters.maxTotalArea || FILTER_DEFAULTS.TOTAL_AREA_MAX,
    ]);
    setPriceRange([
      filters.minPrice || FILTER_DEFAULTS_MIN,
      filters.maxPrice || MAX_PRICE_SLIDER_VALUE,
    ]);
    setDepositRange([
      filters.minDeposit || FILTER_DEFAULTS_MIN,
      filters.maxDeposit || MAX_PRICE_SLIDER_VALUE,
    ]);
    setRentRange([
      filters.minRent || FILTER_DEFAULTS_MIN,
      filters.maxRent || MAX_MONTHLY_RENT_SLIDER_VALUE,
    ]);
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

    // 매매가 필터 처리
    cleanedFilters.minPrice = priceRange[0] > 0 ? priceRange[0] : undefined;
    cleanedFilters.maxPrice =
      priceRange[1] >= FILTER_DEFAULTS.PRICE_MAX ? undefined : priceRange[1];

    // 보증금 필터 처리
    cleanedFilters.minDeposit =
      depositRange[0] > 0 ? depositRange[0] : undefined;
    cleanedFilters.maxDeposit =
      depositRange[1] >= FILTER_DEFAULTS.DEPOSIT_MAX
        ? undefined
        : depositRange[1];

    // 월세 필터 처리
    cleanedFilters.minRent = rentRange[0] > 0 ? rentRange[0] : undefined;
    cleanedFilters.maxRent =
      rentRange[1] >= FILTER_DEFAULTS.MONTHLY_RENT_MAX
        ? undefined
        : rentRange[1];

    if (selectedType) {
      cleanedFilters.type = selectedType as PropertyType;
    } else {
      cleanedFilters.type = undefined;
    }

    onApply(cleanedFilters);
    onClose();
  };

  const handleReset = () => {
    setHasElevator("all");
    setPetsAllowed("all");
    setSelectedType("");
    setNetAreaRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.NET_AREA_MAX]);
    setTotalAreaRange([FILTER_DEFAULTS_MIN, FILTER_DEFAULTS.TOTAL_AREA_MAX]);
    setPriceRange([FILTER_DEFAULTS_MIN, MAX_PRICE_SLIDER_VALUE]);
    setDepositRange([FILTER_DEFAULTS_MIN, MAX_PRICE_SLIDER_VALUE]);
    setRentRange([FILTER_DEFAULTS_MIN, MAX_MONTHLY_RENT_SLIDER_VALUE]);
  };

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
    setNetAreaRange([
      filters.minNetArea || FILTER_DEFAULTS_MIN,
      filters.maxNetArea || FILTER_DEFAULTS.NET_AREA_MAX,
    ]);
    setTotalAreaRange([
      filters.minTotalArea || FILTER_DEFAULTS_MIN,
      filters.maxTotalArea || FILTER_DEFAULTS.TOTAL_AREA_MAX,
    ]);
    setPriceRange([
      filters.minPrice || FILTER_DEFAULTS_MIN,
      filters.maxPrice || FILTER_DEFAULTS.PRICE_MAX,
    ]);
    setDepositRange([
      filters.minDeposit || FILTER_DEFAULTS_MIN,
      filters.maxDeposit || FILTER_DEFAULTS.DEPOSIT_MAX,
    ]);
    setRentRange([
      filters.minRent || FILTER_DEFAULTS_MIN,
      filters.maxRent || FILTER_DEFAULTS.MONTHLY_RENT_MAX,
    ]);
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
      handleRentRangeChange={handleRentRangeChange}
      rentRange={rentRange}
      selectedType={selectedType}
      typeOptions={typeOptions}
      onTypeChange={handleTypeChange}
    />
  );
};

export default AgentPropertyFilterModal;
