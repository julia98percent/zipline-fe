import { SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { PublicPropertyItem, PublicPropertySearchParams } from "@ts/property";
import { getPublicProperties } from "@apis/propertyService";
import PublicPropertyListPageView from "./PublicPropertyListPageView";
import { useUrlPagination } from "@hooks/useUrlPagination";
import { useUrlFilters } from "@hooks/useUrlFilters";
import {
  FILTER_DEFAULTS_MIN,
  FILTER_DEFAULTS,
  MAX_PRICE_SLIDER_VALUE,
  MAX_MONTHLY_RENT_SLIDER_VALUE,
} from "@utils/filterUtil";
interface OutletContext {
  onMobileMenuToggle: () => void;
}

const PublicPropertyListPage = () => {
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [cursorId, setCursorId] = useState<string | null>(null);

  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { rowsPerPage } = useUrlPagination();
  const {
    getParam,
    setParams,
    clearAllFilters,
    searchParams: urlSearchParams,
  } = useUrlFilters();

  const [publicPropertyList, setPublicPropertyList] = useState<
    PublicPropertyItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
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
        : FILTER_DEFAULTS_MIN,
      maxPrice: urlSearchParams.get("maxPrice")
        ? parseInt(urlSearchParams.get("maxPrice")!)
        : MAX_PRICE_SLIDER_VALUE,
      minDeposit: urlSearchParams.get("minDeposit")
        ? parseInt(urlSearchParams.get("minDeposit")!)
        : FILTER_DEFAULTS_MIN,
      maxDeposit: urlSearchParams.get("maxDeposit")
        ? parseInt(urlSearchParams.get("maxDeposit")!)
        : MAX_PRICE_SLIDER_VALUE,
      minMonthlyRent: urlSearchParams.get("minMonthlyRent")
        ? parseInt(urlSearchParams.get("minMonthlyRent")!)
        : FILTER_DEFAULTS_MIN,
      maxMonthlyRent: urlSearchParams.get("maxMonthlyRent")
        ? parseInt(urlSearchParams.get("maxMonthlyRent")!)
        : MAX_MONTHLY_RENT_SLIDER_VALUE,
      minNetArea: urlSearchParams.get("minNetArea")
        ? parseInt(urlSearchParams.get("minNetArea")!)
        : FILTER_DEFAULTS_MIN,
      maxNetArea: urlSearchParams.get("maxNetArea")
        ? parseInt(urlSearchParams.get("maxNetArea")!)
        : FILTER_DEFAULTS.NET_AREA_MAX,
      minTotalArea: urlSearchParams.get("minTotalArea")
        ? parseInt(urlSearchParams.get("minTotalArea")!)
        : FILTER_DEFAULTS_MIN,
      maxTotalArea: urlSearchParams.get("maxTotalArea")
        ? parseInt(urlSearchParams.get("maxTotalArea")!)
        : FILTER_DEFAULTS.TOTAL_AREA_MAX,
      regionCode: urlSearchParams.get("regionCode") || undefined,
    }),
    [rowsPerPage, urlSearchParams, searchAddressQuery]
  );

  const prevSearchParamsRef = useRef<PublicPropertySearchParams>(null);

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
    setCursorId(null);
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
    setCursorId(null);
  };

  const handleSortReset = () => {
    setParams({
      sortField: "id",
      isAscending: true,
    });
    setCursorId(null);
  };

  const handleAddressSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  };

  const handleAddressSearchSubmit = () => {
    setSearchAddressQuery(searchAddress.trim());
    setCursorId(null);
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

  const fetchPropertyData = useCallback(
    async (isLoadMore = false) => {
      if (loading && !isLoadMore) return; // 이미 로딩 중이면 중복 호출 방지

      setLoading(true);

      if (!isLoadMore) {
        setPublicPropertyList([]);
        setCursorId(null);
      }

      try {
        const params = {
          ...searchParams,
          cursorId: isLoadMore ? cursorId : null,
        };

        const response = await getPublicProperties(params);
        const contentArray = Array.isArray(response.content)
          ? response.content
          : [];

        if (isLoadMore) {
          setPublicPropertyList((prev) => [...prev, ...contentArray]);
        } else {
          setPublicPropertyList(contentArray);
        }

        setCursorId(response.nextCursorId);
        setHasNext(response.hasNext);
      } catch (error) {
        if (!isLoadMore) {
          setPublicPropertyList([]);
          setHasNext(false);
        }
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchParams, cursorId, loading]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNext && !loading) {
      fetchPropertyData(true);
    }
  }, [hasNext, loading, fetchPropertyData]);

  useEffect(() => {
    const hasSearchParamsChanged =
      !prevSearchParamsRef.current ||
      JSON.stringify(prevSearchParamsRef.current) !==
        JSON.stringify(searchParams);

    if (hasSearchParamsChanged) {
      prevSearchParamsRef.current = searchParams;

      const fetchData = async () => {
        if (loading) return;

        setLoading(true);
        setPublicPropertyList([]);
        setCursorId(null);

        try {
          const params = {
            ...searchParams,
            cursorId: null,
          };

          const response = await getPublicProperties(params);
          const contentArray = Array.isArray(response.content)
            ? response.content
            : [];

          setPublicPropertyList(contentArray);
          setCursorId(response.nextCursorId);
          setHasNext(response.hasNext);
        } catch (error) {
          setPublicPropertyList([]);
          setHasNext(false);
          console.error("Failed to fetch properties:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [searchParams, loading]);

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
      onMobileMenuToggle={onMobileMenuToggle}
    />
  );
};

export default PublicPropertyListPage;
