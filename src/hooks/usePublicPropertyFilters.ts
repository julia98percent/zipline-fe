import { useState, useCallback } from "react";
import { PublicPropertySearchParams } from "@/types/property";
import { FILTER_DEFAULTS } from "@/utils/filterUtil";

export const usePublicPropertyFilters = (
  setParams: (params: Record<string, string | number | boolean | null>) => void,
  clearAllFilters: () => void
) => {
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [searchAddressQuery, setSearchAddressQuery] = useState<string>("");
  const [useMetric, setUseMetric] = useState(true);

  const handleFilterApply = useCallback(
    (newFilters: Partial<PublicPropertySearchParams>) => {
      if (Object.keys(newFilters).length === 0) {
        clearAllFilters();
      } else {
        const filterParams: Record<string, string | number | boolean | null> =
          {};

        filterParams.minPrice = newFilters.minPrice || null;

        filterParams.maxPrice =
          newFilters.maxPrice && newFilters.maxPrice <= FILTER_DEFAULTS.PRICE_MAX
            ? newFilters.maxPrice
            : null;

        filterParams.minDeposit = newFilters.minDeposit || null;

        filterParams.maxDeposit =
          newFilters.maxDeposit &&
          newFilters.maxDeposit <= FILTER_DEFAULTS.DEPOSIT_MAX
            ? newFilters.maxDeposit
            : null;

        filterParams.minMonthlyRent = newFilters.minMonthlyRent
          ? newFilters.minMonthlyRent
          : null;

        filterParams.maxMonthlyRent =
          newFilters.maxMonthlyRent &&
          newFilters.maxMonthlyRent <= FILTER_DEFAULTS.MONTHLY_RENT_MAX
            ? newFilters.maxMonthlyRent
            : null;

        filterParams.minNetArea = newFilters.minNetArea || null;

        filterParams.maxNetArea =
          newFilters.maxNetArea &&
          newFilters.maxNetArea <= FILTER_DEFAULTS.NET_AREA_MAX
            ? newFilters.maxNetArea
            : null;

        filterParams.minTotalArea = newFilters.minTotalArea || null;

        filterParams.maxTotalArea =
          newFilters.maxTotalArea &&
          newFilters.maxTotalArea <= FILTER_DEFAULTS.TOTAL_AREA_MAX
            ? newFilters.maxTotalArea
            : null;

        filterParams.category = newFilters.category || null;

        filterParams.buildingType = newFilters.buildingType || null;

        filterParams.buildingName = newFilters.buildingName || null;

        filterParams.regionCode = newFilters.regionCode || null;

        setParams(filterParams);
      }
      setShowFilterModal(false);
    },
    [setParams, clearAllFilters]
  );

  const handleAddressSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  };

  const handleAddressSearchSubmit = useCallback(() => {
    setSearchAddressQuery(searchAddress.trim());
  }, [searchAddress]);

  const handleMetricToggle = useCallback(() => {
    setUseMetric((prev) => !prev);
  }, []);

  const handleFilterModalToggle = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  const handleFilterModalClose = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  return {
    showFilterModal,
    searchAddress,
    searchAddressQuery,
    useMetric,
    handleFilterApply,
    handleAddressSearch,
    handleAddressSearchSubmit,
    handleMetricToggle,
    handleFilterModalToggle,
    handleFilterModalClose,
  };
};
