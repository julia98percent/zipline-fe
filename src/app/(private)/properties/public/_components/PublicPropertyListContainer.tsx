"use client";
import { useMemo } from "react";
import PublicPropertyListView from "./PublicPropertyListView";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { usePublicProperties } from "@/queries/usePublicProperties";
import { usePublicPropertySearchParams } from "@/hooks/usePublicPropertySearchParams";
import { usePublicPropertyFilters } from "@/hooks/usePublicPropertyFilters";
import { usePublicPropertyRegion } from "@/hooks/usePublicPropertyRegion";
import { usePublicPropertySort } from "@/hooks/usePublicPropertySort";

const PublicPropertyListContainer = () => {
  const {
    getParam,
    setParams,
    clearAllFilters,
    searchParams: urlSearchParams,
  } = useUrlFilters();

  const {
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
  } = usePublicPropertyFilters(setParams, clearAllFilters);

  const searchParams = usePublicPropertySearchParams(
    urlSearchParams,
    searchAddressQuery
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

  const { handleSidoChange, handleGuChange, handleDongChange } =
    usePublicPropertyRegion(selectedSido, selectedGu, setParams);

  const { handleSort, handleSortReset } = usePublicPropertySort(
    getParam,
    setParams
  );

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
