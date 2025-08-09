import { useEffect, useState, useCallback, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useUrlPagination } from "@hooks/useUrlPagination";
import { useUrlFilters } from "@hooks/useUrlFilters";
import AgentPropertyListPageView from "./AgentPropertyListPageView";
import {
  searchAgentProperties,
  AgentPropertySearchParams,
} from "@apis/propertyService";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import { Property, PropertyType, PropertyCategoryType } from "@ts/property";
import { Region } from "@ts/region";
import { showToast } from "@components/Toast";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "ONE_ROOM", label: "원룸" },
  { value: "TWO_ROOM", label: "투룸" },
  { value: "APARTMENT", label: "아파트" },
  { value: "VILLA", label: "빌라" },
  { value: "HOUSE", label: "주택" },
  { value: "OFFICETEL", label: "오피스텔" },
  { value: "COMMERCIAL", label: "상가" },
];

const TYPE_OPTIONS = [
  { value: "SALE", label: "매매" },
  { value: "DEPOSIT", label: "전세" },
  { value: "MONTHLY", label: "월세" },
];

function AgentPropertyListPage() {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();
  const {
    getParam,
    setParam,
    setParams,
    clearAllFilters,
    searchParams: urlSearchParams,
  } = useUrlFilters();

  // 상태 관리
  const [loading, setLoading] = useState(false);
  const [agentPropertyList, setAgentPropertyList] = useState<Property[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // 지역 관련 상태
  const [regions, setRegions] = useState<Region[]>([]);
  const [sigunguOptions, setSigunguOptions] = useState<Region[]>([]);
  const [dongOptions, setDongOptions] = useState<Region[]>([]);
  const selectedSido = getParam("sido");
  const selectedGu = getParam("gu");
  const selectedDong = getParam("dong");

  const searchParams = useMemo(
    () => ({
      page,
      size: rowsPerPage,
      sortFields: {},
      category: (getParam("category") as PropertyCategoryType) || undefined,
      type: (getParam("type") as PropertyType) || undefined,
      legalDistrictCode: getParam("legalDistrictCode") || undefined,
      minPrice: getParam("minPrice")
        ? parseInt(getParam("minPrice"))
        : undefined,
      maxPrice: getParam("maxPrice")
        ? parseInt(getParam("maxPrice"))
        : undefined,
      minDeposit: getParam("minDeposit")
        ? parseInt(getParam("minDeposit"))
        : undefined,
      maxDeposit: getParam("maxDeposit")
        ? parseInt(getParam("maxDeposit"))
        : undefined,
      minRent: getParam("minRent") ? parseInt(getParam("minRent")) : undefined,
      maxRent: getParam("maxRent") ? parseInt(getParam("maxRent")) : undefined,
      minNetArea: getParam("minNetArea")
        ? parseInt(getParam("minNetArea"))
        : undefined,
      maxNetArea: getParam("maxNetArea")
        ? parseInt(getParam("maxNetArea"))
        : undefined,
      minTotalArea: getParam("minTotalArea")
        ? parseInt(getParam("minTotalArea"))
        : undefined,
      maxTotalArea: getParam("maxTotalArea")
        ? parseInt(getParam("maxTotalArea"))
        : undefined,
      hasElevator: getParam("hasElevator")
        ? getParam("hasElevator") === "true"
        : undefined,
      petsAllowed: getParam("petsAllowed")
        ? getParam("petsAllowed") === "true"
        : undefined,
    }),
    [page, rowsPerPage, urlSearchParams]
  );

  const fetchProperties = useCallback(
    async (params: AgentPropertySearchParams) => {
      try {
        setLoading(true);
        const response = await searchAgentProperties(params);

        const propertyData = response.data?.agentProperty || [];
        const totalElements = response.data?.totalElements || 0;

        setAgentPropertyList(propertyData);
        setTotalElements(totalElements);
      } catch (error) {
        console.error("Error fetching agent properties:", error);
        showToast({
          message: "매물 목록을 불러오는데 실패했습니다.",
          type: "error",
        });
        setAgentPropertyList([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadRegions = useCallback(async () => {
    try {
      const regionsData = await fetchSido();
      setRegions(regionsData);
    } catch (error) {
      console.error("Error loading regions:", error);
    }
  }, []);

  const loadSigunguOptions = useCallback(async (sidoCode: string) => {
    if (!sidoCode) {
      setSigunguOptions([]);
      return;
    }
    try {
      const data = await fetchSigungu(parseInt(sidoCode));
      setSigunguOptions(data);
    } catch (error) {
      console.error("Error loading sigungu:", error);
      setSigunguOptions([]);
    }
  }, []);

  const loadDongOptions = useCallback(async (sigugunCode: string) => {
    if (!sigugunCode) {
      setDongOptions([]);
      return;
    }
    try {
      const data = await fetchDong(parseInt(sigugunCode));
      setDongOptions(data);
    } catch (error) {
      console.error("Error loading dong:", error);
      setDongOptions([]);
    }
  }, []);

  const handleSidoChange = useCallback(
    async (e: SelectChangeEvent) => {
      const newSido = String(e.target.value);
      await loadSigunguOptions(newSido);
      setDongOptions([]);

      setParams({
        sido: newSido || null,
        gu: null,
        dong: null,
        legalDistrictCode: newSido ? newSido.slice(0, 2) : null,
      });
    },
    [setParams, loadSigunguOptions]
  );

  const handleGuChange = useCallback(
    async (e: SelectChangeEvent) => {
      const newGu = String(e.target.value);
      await loadDongOptions(newGu);

      setParams({
        gu: newGu || null,
        dong: null,
        legalDistrictCode: newGu
          ? newGu.slice(0, 5)
          : selectedSido
          ? selectedSido.slice(0, 2)
          : null,
      });
    },
    [setParams, selectedSido, loadDongOptions]
  );

  const handleDongChange = useCallback(
    async (e: SelectChangeEvent) => {
      const newDong = String(e.target.value);

      setParams({
        dong: newDong || null,
        legalDistrictCode: newDong
          ? newDong.slice(0, 8)
          : selectedGu
          ? selectedGu.slice(0, 5)
          : selectedSido
          ? selectedSido.slice(0, 2)
          : null,
      });
    },
    [setParams, selectedSido, selectedGu]
  );

  const handleCategoryChange = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      const value =
        (e.target.value as string) === "" ? null : (e.target.value as string);
      setParam("category", value || "");
    },
    [setParam]
  );

  const handleTypeChange = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      const value =
        (e.target.value as string) === "" ? null : (e.target.value as string);
      setParam("type", value || "");
    },
    [setParam]
  );

  const handleFilterApply = useCallback(
    (newFilters: Partial<AgentPropertySearchParams>) => {
      const filterParams: Record<string, string | number | boolean | null> = {};

      filterParams.minPrice = newFilters.minPrice || null;
      filterParams.maxPrice = newFilters.maxPrice || null;
      filterParams.minDeposit = newFilters.minDeposit || null;
      filterParams.maxDeposit = newFilters.maxDeposit || null;
      filterParams.minRent = newFilters.minRent || null;
      filterParams.maxRent = newFilters.maxRent || null;

      filterParams.minNetArea = newFilters.minNetArea || null;
      filterParams.maxNetArea = newFilters.maxNetArea || null;
      filterParams.minTotalArea = newFilters.minTotalArea || null;
      filterParams.maxTotalArea = newFilters.maxTotalArea || null;

      filterParams.hasElevator =
        typeof newFilters.hasElevator === "boolean"
          ? newFilters.hasElevator
          : null;
      filterParams.petsAllowed =
        typeof newFilters.petsAllowed === "boolean"
          ? newFilters.petsAllowed
          : null;

      filterParams.type = newFilters.type || null;

      setParams(filterParams);
      setShowFilterModal(false);
    },
    [setParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleRowsPerPageChange = useCallback(
    (newSize: number) => {
      setRowsPerPage(newSize);
    },
    [setRowsPerPage]
  );

  const handleFilterModalToggle = useCallback(() => {
    setShowFilterModal(!showFilterModal);
  }, [showFilterModal]);

  const handleFilterModalClose = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  const handleReset = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  const handleSaveProperty = useCallback(() => {
    // 매물 저장 후 목록 새로고침
    fetchProperties(searchParams);
  }, [fetchProperties, searchParams]);

  useEffect(() => {
    fetchProperties(searchParams);
  }, [fetchProperties, searchParams]);

  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  useEffect(() => {
    if (selectedSido) {
      loadSigunguOptions(selectedSido);
    }
  }, [selectedSido, loadSigunguOptions]);

  useEffect(() => {
    if (selectedGu) {
      loadDongOptions(selectedGu);
    }
  }, [selectedGu, loadDongOptions]);

  return (
    <AgentPropertyListPageView
      loading={loading}
      agentPropertyList={agentPropertyList}
      totalElements={totalElements}
      searchParams={searchParams}
      showFilterModal={showFilterModal}
      regions={regions}
      selectedSido={selectedSido}
      selectedGu={selectedGu}
      selectedDong={selectedDong}
      categoryOptions={CATEGORY_OPTIONS}
      typeOptions={TYPE_OPTIONS}
      sigunguOptions={sigunguOptions}
      dongOptions={dongOptions}
      onSidoChange={handleSidoChange}
      onGuChange={handleGuChange}
      onDongChange={handleDongChange}
      onCategoryChange={handleCategoryChange}
      onTypeChange={handleTypeChange}
      onFilterApply={handleFilterApply}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onFilterModalToggle={handleFilterModalToggle}
      onFilterModalClose={handleFilterModalClose}
      onReset={handleReset}
      onSaveProperty={handleSaveProperty}
      onMobileMenuToggle={onMobileMenuToggle}
    />
  );
}

export default AgentPropertyListPage;
