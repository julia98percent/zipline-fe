"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import AgentPropertyListView from "./AgentPropertyListView";
import {
  searchAgentProperties,
  AgentPropertySearchParams,
} from "@/apis/propertyService";
import { Property, PropertyType, PropertyCategoryType } from "@/types/property";
import { showToast } from "@/components/Toast";

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

interface AgentPropertyListContainerProps {
  initialProperties: Property[];
  initialTotalElements: number;
}

function AgentPropertyListContainer({
  initialProperties,
  initialTotalElements,
}: AgentPropertyListContainerProps) {
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();
  const {
    getParam,
    setParam,
    setParams,
    clearAllFilters,
    searchParams: urlSearchParams,
  } = useUrlFilters();

  const [loading, setLoading] = useState(false);
  const [agentPropertyList, setAgentPropertyList] =
    useState<Property[]>(initialProperties);
  const [totalElements, setTotalElements] = useState(initialTotalElements);
  const [showFilterModal, setShowFilterModal] = useState(false);

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


  const handleCategoryChange = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      const value =
        (e.target.value as string) === "" ? null : (e.target.value as string);
      setParam("category", value || "");
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

  return (
    <AgentPropertyListView
      loading={loading}
      agentPropertyList={agentPropertyList}
      totalElements={totalElements}
      searchParams={searchParams}
      showFilterModal={showFilterModal}
      categoryOptions={CATEGORY_OPTIONS}
      typeOptions={TYPE_OPTIONS}
      onCategoryChange={handleCategoryChange}
      onFilterApply={handleFilterApply}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onFilterModalToggle={handleFilterModalToggle}
      onFilterModalClose={handleFilterModalClose}
      onReset={handleReset}
      onSaveProperty={handleSaveProperty}
    />
  );
}

export default AgentPropertyListContainer;
