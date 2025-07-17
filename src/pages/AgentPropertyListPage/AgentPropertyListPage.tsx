import { useEffect, useState, useCallback } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AgentPropertyListPageView from "./AgentPropertyListPageView";
import {
  searchAgentProperties,
  AgentPropertySearchParams,
} from "@apis/propertyService";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import { Property, PropertyType, PropertyCategoryType } from "@ts/property";
import { Region } from "@ts/region";
import { showToast } from "@components/Toast";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const DEFAULT_SEARCH_PARAMS: AgentPropertySearchParams = {
  page: 0,
  size: DEFAULT_ROWS_PER_PAGE,
  sortFields: {},
};

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

  // 상태 관리
  const [loading, setLoading] = useState(false);
  const [agentPropertyList, setAgentPropertyList] = useState<Property[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState<AgentPropertySearchParams>(
    DEFAULT_SEARCH_PARAMS
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  // 지역 관련 상태
  const [regions, setRegions] = useState<Region[]>([]);
  const [sigunguOptions, setSigunguOptions] = useState<Region[]>([]);
  const [dongOptions, setDongOptions] = useState<Region[]>([]);
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  // API 호출 함수
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

  // 이벤트 핸들러
  const handleSidoChange = useCallback(
    async (e: SelectChangeEvent) => {
      const newSido = String(e.target.value);
      setSelectedSido(newSido);
      setSelectedGu("");
      setSelectedDong("");

      await loadSigunguOptions(newSido);
      setDongOptions([]);

      const newParams = {
        ...searchParams,
        page: 0,
        legalDistrictCode: newSido ? newSido.slice(0, 2) : undefined,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
    },
    [searchParams, fetchProperties, loadSigunguOptions]
  );

  const handleGuChange = useCallback(
    async (e: SelectChangeEvent) => {
      const newGu = String(e.target.value);
      setSelectedGu(newGu);
      setSelectedDong("");

      await loadDongOptions(newGu);

      const newParams = {
        ...searchParams,
        page: 0,
        legalDistrictCode: newGu
          ? newGu.slice(0, 5)
          : selectedSido
          ? selectedSido.slice(0, 2)
          : undefined,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
    },
    [searchParams, fetchProperties, selectedSido, loadDongOptions]
  );

  const handleDongChange = useCallback(
    async (e: SelectChangeEvent) => {
      const newDong = String(e.target.value);
      setSelectedDong(newDong);

      const newParams = {
        ...searchParams,
        page: 0,
        legalDistrictCode: newDong
          ? newDong.slice(0, 8)
          : selectedGu
          ? selectedGu.slice(0, 5)
          : selectedSido
          ? selectedSido.slice(0, 2)
          : undefined,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
    },
    [searchParams, fetchProperties, selectedSido, selectedGu]
  );

  const handleCategoryChange = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      const value =
        (e.target.value as string) === ""
          ? undefined
          : (e.target.value as PropertyCategoryType);
      const newParams = {
        ...searchParams,
        page: 0,
        category: value,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
    },
    [searchParams, fetchProperties]
  );

  const handleTypeChange = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      const value =
        (e.target.value as string) === ""
          ? undefined
          : (e.target.value as PropertyType);
      const newParams = {
        ...searchParams,
        page: 0,
        type: value,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
    },
    [searchParams, fetchProperties]
  );

  const handleFilterApply = useCallback(
    (newFilters: Partial<AgentPropertySearchParams>) => {
      const newParams = {
        ...searchParams,
        ...newFilters,
        page: 0,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
      setShowFilterModal(false);
    },
    [searchParams, fetchProperties]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newParams = {
        ...searchParams,
        page: newPage,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
    },
    [searchParams, fetchProperties]
  );

  const handleRowsPerPageChange = useCallback(
    (newSize: number) => {
      const newParams = {
        ...searchParams,
        page: 0,
        size: newSize,
      };
      setSearchParams(newParams);
      fetchProperties(newParams);
    },
    [searchParams, fetchProperties]
  );

  const handleFilterModalToggle = useCallback(() => {
    setShowFilterModal(!showFilterModal);
  }, [showFilterModal]);

  const handleFilterModalClose = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchProperties(searchParams);
  }, [fetchProperties, searchParams]);

  const handleAddProperty = useCallback(() => {
    setShowAddPropertyModal(true);
  }, []);

  const handleCloseAddPropertyModal = useCallback(() => {
    setShowAddPropertyModal(false);
  }, []);

  const handleSaveProperty = useCallback(() => {
    // 매물 저장 후 목록 새로고침
    fetchProperties(searchParams);
    setShowAddPropertyModal(false);
  }, [fetchProperties, searchParams]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchProperties(DEFAULT_SEARCH_PARAMS);
    loadRegions();
  }, [fetchProperties, loadRegions]);

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
      onRefresh={handleRefresh}
      onAddProperty={handleAddProperty}
      showAddPropertyModal={showAddPropertyModal}
      onCloseAddPropertyModal={handleCloseAddPropertyModal}
      onSaveProperty={handleSaveProperty}
      onMobileMenuToggle={onMobileMenuToggle}
    />
  );
}

export default AgentPropertyListPage;
