import { SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { PublicPropertyItem, PublicPropertySearchParams } from "@ts/property";
import { searchPublicProperties } from "@apis/propertyService";
import PublicPropertyListPageView from "./PublicPropertyListPageView";

const INITIAL_SEARCH_PARAMS: PublicPropertySearchParams = {
  page: 0,
  size: 20,
  sortFields: { id: "ASC" },
  category: "",
  buildingType: "",
  buildingName: "",
  address: "",
  minPrice: undefined,
  maxPrice: undefined,
  minDeposit: undefined,
  maxDeposit: undefined,
  minMonthlyRent: undefined,
  maxMonthlyRent: undefined,
  minExclusiveArea: undefined,
  maxExclusiveArea: undefined,
  minSupplyArea: undefined,
  maxSupplyArea: undefined,
};
const PublicPropertyListPage = () => {
  const [publicPropertyList, setPublicPropertyList] = useState<
    PublicPropertyItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
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
        page: 0,
      }));
    }
  };

  const handleSort = (field: string) => {
    setSearchParams((prev) => {
      const currentSort = prev.sortFields[field];
      const newSortFields: { [key: string]: string } = {};

      if (currentSort) {
        newSortFields[field] = currentSort === "ASC" ? "DESC" : "ASC";
      } else {
        newSortFields[field] = "ASC";
      }

      return {
        ...prev,
        sortFields: newSortFields,
        page: 0,
      };
    });
  };

  const handleSortReset = () => {
    setSearchParams((prev) => ({
      ...prev,
      sortFields: { id: "ASC" },
      page: 0,
    }));
  };

  const handleAddressSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  };

  const handleAddressSearchSubmit = () => {
    if (searchAddress.trim()) {
      setSearchParams((prev) => ({
        ...prev,
        address: searchAddress.trim(),
        page: 0,
      }));
    } else {
      setSearchParams((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { address, ...rest } = prev;
        return {
          ...rest,
          page: 0,
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
      totalElements={totalElements}
      totalPages={totalPages}
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
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onMetricToggle={handleMetricToggle}
      onFilterModalToggle={handleFilterModalToggle}
      onFilterModalClose={handleFilterModalClose}
    />
  );
};

export default PublicPropertyListPage;
