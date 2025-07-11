import { SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { PublicPropertyItem, PublicPropertySearchParams } from "@ts/property";
import { searchPublicProperties } from "@apis/propertyService";
import PublicPropertyListPageView from "./PublicPropertyListPageView";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";

const INITIAL_SEARCH_PARAMS: PublicPropertySearchParams = {
  cursorId: null,
  size: DEFAULT_ROWS_PER_PAGE,
  sortField: "id",
  isAscending: true,
  category: undefined,
  buildingType: undefined,
  buildingName: undefined,
  address: undefined,
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
};

const PublicPropertyListPage = () => {
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [cursorId, setCursorId] = useState<string | null>(null);

  const [publicPropertyList, setPublicPropertyList] = useState<
    PublicPropertyItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [searchAddress, setSearchAddress] = useState<string>("");

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const [useMetric, setUseMetric] = useState(true);

  const [searchParams, setSearchParams] = useState<PublicPropertySearchParams>(
    INITIAL_SEARCH_PARAMS
  );

  const handleSidoChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedSido(value);
    setSelectedGu("");
    setSelectedDong("");
  };

  const handleGuChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedGu(value);
    setSelectedDong("");
  };

  const handleDongChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedDong(value);

    if (!value) {
      setSearchParams((prev) => ({ ...prev, regionCode: undefined }));
    }
  };

  const handleFilterApply = (
    newFilters: Partial<PublicPropertySearchParams>
  ) => {
    if (Object.keys(newFilters).length === 0) {
      setSearchParams(INITIAL_SEARCH_PARAMS);
    } else {
      setSearchParams((prev) => ({
        ...prev,
        ...newFilters,
        cursorId: null,
      }));
    }
  };

  const handleSort = (field: string) => {
    setSearchParams((prev) => {
      const currentSortField = "sortField" in prev ? prev.sortField : null;
      const currentIsAscending =
        "isAscending" in prev ? prev.isAscending : null;

      const newSortField = field;
      let newIsAscending = true;

      if (currentSortField === field && currentIsAscending !== null) {
        newIsAscending = !currentIsAscending;
      }

      return {
        ...prev,
        sortField: newSortField,
        isAscending: newIsAscending,
        cursorId: null,
      };
    });
  };

  const handleSortReset = () => {
    setSearchParams((prev) => {
      const { sortField, isAscending, ...rest } =
        prev as PublicPropertySearchParams;
      return {
        ...rest,
        sortField: "id",
        isAscending: true,
        cursorId: null,
      };
    });
  };

  const handleAddressSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  };

  const handleAddressSearchSubmit = () => {
    if (searchAddress.trim()) {
      setSearchParams((prev) => ({
        ...prev,
        address: searchAddress.trim(),
        cursorId: null,
      }));
    } else {
      setSearchParams((prev) => {
        const { address, ...rest } = prev;
        return {
          ...rest,
          cursorId: null,
        };
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newSize: number) => {
    setSearchParams((prev) => ({ ...prev, size: newSize, page: 0 }));
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

  const fetchPropertyData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await searchPublicProperties(searchParams);

      setPublicPropertyList(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch {
      setPublicPropertyList([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  return (
    <PublicPropertyListPageView
      loading={loading}
      publicPropertyList={publicPropertyList}
      hasNext={hasNext}
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

export default PublicPropertyListPage;
