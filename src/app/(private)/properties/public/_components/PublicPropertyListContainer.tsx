"use client";
import { SelectChangeEvent } from "@mui/material";
import { useState, useMemo } from "react";
import { PublicPropertySearchParams } from "@/types/property";
import PublicPropertyListView from "./PublicPropertyListView";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { FILTER_DEFAULTS } from "@/utils/filterUtil";
import { usePublicProperties } from "@/queries/usePublicProperties";

const PublicPropertyListContainer = () => {
  const { rowsPerPage } = useUrlPagination();
  const {
    getParam,
    setParams,
    clearAllFilters,
    searchParams: urlSearchParams,
  } = useUrlFilters();

  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [searchAddressQuery, setSearchAddressQuery] = useState<string>("");
  const [useMetric, setUseMetric] = useState(true);

  const searchParams = useMemo(
    () => ({
      size: rowsPerPage,
      sortField: urlSearchParams.get("sortField") || "id",
      isAscending: urlSearchParams.get("isAscending") !== "false",
      category: urlSearchParams.get("category") || undefined,
      buildingType: urlSearchParams.get("buildingType") || undefined,
      buildingName: urlSearchParams.get("buildingName") || undefined,
      address: searchAddressQuery || undefined,
      minPrice: urlSearchParams.get("minPrice")
        ? parseInt(urlSearchParams.get("minPrice")!)
        : undefined,
      maxPrice: urlSearchParams.get("maxPrice")
        ? parseInt(urlSearchParams.get("maxPrice")!)
        : undefined,
      minDeposit: urlSearchParams.get("minDeposit")
        ? parseInt(urlSearchParams.get("minDeposit")!)
        : undefined,
      maxDeposit: urlSearchParams.get("maxDeposit")
        ? parseInt(urlSearchParams.get("maxDeposit")!)
        : undefined,
      minMonthlyRent: urlSearchParams.get("minMonthlyRent")
        ? parseInt(urlSearchParams.get("minMonthlyRent")!)
        : undefined,
      maxMonthlyRent: urlSearchParams.get("maxMonthlyRent")
        ? parseInt(urlSearchParams.get("maxMonthlyRent")!)
        : undefined,
      minNetArea: urlSearchParams.get("minNetArea")
        ? parseInt(urlSearchParams.get("minNetArea")!)
        : undefined,
      maxNetArea: urlSearchParams.get("maxNetArea")
        ? parseInt(urlSearchParams.get("maxNetArea")!)
        : undefined,
      minTotalArea: urlSearchParams.get("minTotalArea")
        ? parseInt(urlSearchParams.get("minTotalArea")!)
        : undefined,
      maxTotalArea: urlSearchParams.get("maxTotalArea")
        ? parseInt(urlSearchParams.get("maxTotalArea")!)
        : undefined,
      regionCode: urlSearchParams.get("regionCode") || undefined,
    }),
    [rowsPerPage, urlSearchParams, searchAddressQuery]
  );

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    usePublicProperties(searchParams);

  const publicPropertyList = useMemo(
    () => data?.pages?.flatMap((page) => page.content) ?? [],
    [data]
  );

  const selectedSido = getParam("selectedSido") || "";
  const selectedGu = getParam("selectedGu") || "";
  const selectedDong = getParam("selectedDong") || "";

  const handleSidoChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setParams({
      selectedSido: value || null,
      selectedGu: null,
      selectedDong: null,
      regionCode: value ? value.slice(0, 2) : null,
    });
  };

  const handleGuChange = (event: SelectChangeEvent<string>) => {
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
  };

  const handleDongChange = (event: SelectChangeEvent<string>) => {
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
  };

  const handleFilterApply = (
    newFilters: Partial<PublicPropertySearchParams>
  ) => {
    if (Object.keys(newFilters).length === 0) {
      clearAllFilters();
    } else {
      const filterParams: Record<string, string | number | boolean | null> = {};

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
  };

  const handleSort = (field: string) => {
    const currentSortField = getParam("sortField") || "id";
    const currentIsAscending = getParam("isAscending") !== "false";

    const newSortField = field;
    let newIsAscending = true;

    if (currentSortField === field) {
      newIsAscending = !currentIsAscending;
    }

    setParams({
      sortField: newSortField,
      isAscending: newIsAscending,
    });
  };

  const handleSortReset = () => {
    setParams({
      sortField: "id",
      isAscending: true,
    });
  };

  const handleAddressSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  };

  const handleAddressSearchSubmit = () => {
    setSearchAddressQuery(searchAddress.trim());
  };

  const handleMetricToggle = () => {
    setUseMetric((prev) => !prev);
  };

  const handleFilterModalToggle = () => {
    setShowFilterModal(true);
  };

  const handleFilterModalClose = () => {
    setShowFilterModal(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <PublicPropertyListView
      loading={isLoading || isFetchingNextPage}
      publicPropertyList={publicPropertyList}
      hasNext={hasNextPage ?? false}
      searchAddress={searchAddress}
      selectedSido={selectedSido}
      selectedGu={selectedGu}
      selectedDong={selectedDong}
      useMetric={useMetric}
      showFilterModal={showFilterModal}
      searchParams={searchParams}
      onSidoChange={handleSidoChange}
      onGuChange={handleGuChange}
      onDongChange={handleDongChange}
      onFilterApply={handleFilterApply}
      onSort={handleSort}
      onSortReset={handleSortReset}
      onAddressSearch={handleAddressSearch}
      onAddressSearchSubmit={handleAddressSearchSubmit}
      onLoadMore={handleLoadMore}
      onMetricToggle={handleMetricToggle}
      onFilterModalToggle={handleFilterModalToggle}
      onFilterModalClose={handleFilterModalClose}
    />
  );
};

export default PublicPropertyListContainer;
