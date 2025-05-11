import { useEffect, useState, useCallback } from "react";
import apiClient from "@apis/apiClient";
import PropertyTable from "./PropertyTable";
import PropertyFilterModal from "./PropertyFilterModal/PropertyFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import { CircularProgress } from "@mui/material";
import { AgentPropertyFilterRequest } from "../../types/AgentPropertyFilterRequest";
import {
  PageContainer,
  ContentContainer,
  FilterButtonWrapper,
  FilterButton,
  LoadingContainer,
  TopFilterBar,
  AddressSelectBox,
  CategoryButtonGroup,
  TypeButtonGroup,
  StyledSelect,
  FilterContainer,
  LeftButtonGroup,
  RightButtonGroup,
  menuItemStyles,
  selectMenuProps,
} from "./styles/PrivatePropertyListPage.styles";
import { MenuItem, SelectChangeEvent } from "@mui/material";
import PropertyAddButtonList from "./PropertyAddButtonList";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";

export interface PropertyItem {
  uid: number;
  customerName: string;
  address: string;
  detailAddress: string | null;
  deposit: number | null;
  monthlyRent: number | null;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  moveInDate: string | null;
  realCategory:
    | "ONE_ROOM"
    | "TWO_ROOM"
    | "APARTMENT"
    | "VILLA"
    | "HOUSE"
    | "OFFICETEL"
    | "COMMERCIAL";
  petsAllowed: boolean;
  floor: number | null;
  hasElevator: boolean;
  constructionYear: number | null;
  parkingCapacity: number | null;
  netArea: number;
  totalArea: number;
  details: string | null;
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

// 필터 상태를 전역적으로 관리하는 store
interface FilterStore {
  filter: AgentPropertyFilterRequest;
  setFilter: (filter: AgentPropertyFilterRequest) => void;
  resetFilter: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  filter: {},
  setFilter: (filter) => set({ filter }),
  resetFilter: () => set({ filter: {} }),
}));

function PrivatePropertyListPage() {
  const [privatePropertyList, setPrivatePropertyList] = useState<
    PropertyItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const { filter, setFilter, resetFilter } = useFilterStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [region, setRegion] = useState({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: "",
    selectedSigungu: "",
    selectedDong: "",
  });
  const updateLegalDistrictCode = (newState: typeof region) => {
    const code = newState.selectedDong || newState.selectedSigungu || newState.selectedSido;
  
    let prefix = "";
  
    if (newState.selectedDong) {
      prefix = String(code).slice(0, 8); // 동: 앞 8자리 (정확한 법정동코드)
    } else if (newState.selectedSigungu) {
      prefix = String(code).slice(0, 5); // 구/군: 앞 5자리
    } else if (newState.selectedSido) {
      prefix = String(code).slice(0, 2); // 시/도: 앞 2자리
    }
  
    setFilter((prev: AgentPropertyFilterRequest) => ({
      ...prev,
      legalDistrictCode: prefix || undefined,
    }));
  };

  // 카테고리/유형 필터 핸들러
  const handleCategoryChange = (e: SelectChangeEvent<unknown>) => {
    const value =
      (e.target.value as string) === ""
        ? undefined
        : (e.target.value as PropertyItem["realCategory"]);
    setFilter((prev: AgentPropertyFilterRequest) => ({ ...prev, category: value }));
  };
  const handleTypeChange = (e: SelectChangeEvent<unknown>) => {
    const value =
      (e.target.value as string) === ""
        ? undefined
        : (e.target.value as PropertyItem["type"]);
    setFilter((prev: AgentPropertyFilterRequest) => ({ ...prev, type: value }));
  };

  const fetchPropertyData = useCallback(() => {
    setLoading(true);
    apiClient
      .get("/properties", {
        params: {
          ...filter,
          page: page + 1, 
          size: rowsPerPage,
        },
      })
      .then((res) => {
        const data = res.data?.data;
        setPrivatePropertyList(data.agentProperty || []);
        setTotalElements(data.totalElements || 0);
      })
      .catch((error) => {
        console.error("Failed to fetch properties:", error);
        setPrivatePropertyList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, rowsPerPage]);

  const fetchFilteredProperties = useCallback(() => {
    setLoading(true);    
    const currentFilter = useFilterStore.getState().filter;
    apiClient
      .get("/properties", {
        params: {
          ...currentFilter,
          page: 0,
          size: 10,
        },
      })
      .then((res) => {
        const agentPropertyData = res?.data?.data?.agentProperty;
        setPrivatePropertyList(agentPropertyData || []);
        setTotalElements(res?.data?.data?.totalElements || 0);
      })
      .catch((error) => {
        console.error("Failed to fetch filtered properties:", error);
        setPrivatePropertyList([]);
        setTotalElements(0);
      })
      .finally(() => {
        setLoading(false);
        setFilterModalOpen(false);
      });
  }, []); 

  useEffect(() => {    
    fetchFilteredProperties();    
  }, [filter.category, filter.type, filter.legalDistrictCode]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  useEffect(() => {
    apiClient.get("/region/0").then((res) => {
      setRegion((prev) => ({ ...prev, sido: res.data.data }));
    });
  }, []);

  useEffect(() => {
    if (!region.selectedSido) return;
    apiClient.get(`/region/${region.selectedSido}`).then((res) => {
      setRegion((prev) => ({
        ...prev,
        sigungu: res.data.data,
        selectedSigungu: "",
        dong: [],
        selectedDong: "",
      }));
    });
  }, [region.selectedSido]);

  useEffect(() => {
    if (!region.selectedSigungu) return;
    apiClient.get(`/region/${region.selectedSigungu}`).then((res) => {
      setRegion((prev) => ({
        ...prev,
        dong: res.data.data,
        selectedDong: "",
      }));
    });
  }, [region.selectedSigungu]);

  const handleSidoChange = (e: SelectChangeEvent<string>) => {
    const newSido = e.target.value;
    const newState = {
      ...region,
      selectedSido: newSido,
      selectedSigungu: "",
      selectedDong: "",
    };
    setRegion(newState);
    updateLegalDistrictCode(newState);
  };

  const handleGuChange = (e: SelectChangeEvent<string>) => {
    const newSigungu = e.target.value;
    const newState = {
      ...region,
      selectedSigungu: newSigungu,
      selectedDong: "",
    };
    setRegion(newState);
    updateLegalDistrictCode(newState);
  };

  const handleDongChange = (e: SelectChangeEvent<string>) => {
    const newDong = e.target.value;
    const newState = {
      ...region,
      selectedDong: newDong,
    };
    setRegion(newState);
    updateLegalDistrictCode(newState);
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="내 매물 목록" userName={user?.name || "-"} />
        <LoadingContainer>
          <CircularProgress color="primary" />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="내 매물 목록" userName={user?.name || "-"} />

      <ContentContainer>
        {/* 상단 필터 바 */}
        <TopFilterBar>
          {/* 주소 체크 (시/군/구/동) */}
          <Box sx={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AddressSelectBox
              sx={{ background: "#fff", boxShadow: "none", padding: 0 }}
            >
              <StyledSelect
                size="small"
                value={region.selectedSido}
                displayEmpty
                onChange={handleSidoChange as (e: SelectChangeEvent<unknown>) => void}
                sx={{ width: 120, height: 35 }}
              >
                <MenuItem value="">시/도</MenuItem>
                {region.sido.map((sido: any) => (
                  <MenuItem key={sido.cortarNo} value={sido.cortarNo}>
                    {sido.cortarName}
                  </MenuItem>
                ))}
              </StyledSelect>

              <StyledSelect
                size="small"
                value={region.selectedSigungu}
                displayEmpty
                onChange={handleGuChange as (e: SelectChangeEvent<unknown>) => void}
                sx={{ width: 120, height: 35 }}
                disabled={!region.selectedSido}
              >
                <MenuItem value="">시/군/구</MenuItem>
                {region.sigungu.map((gu: any) => (
                  <MenuItem key={gu.cortarNo} value={gu.cortarNo}>
                    {gu.cortarName}
                  </MenuItem>
                ))}
              </StyledSelect>

              <StyledSelect
                size="small"
                value={region.selectedDong}
                displayEmpty
                onChange={handleDongChange as (e: SelectChangeEvent<unknown>) => void}
                sx={{ width: 120, height: 35 }}
                disabled={!region.selectedSigungu}
              >
                <MenuItem value="">동</MenuItem>
                {region.dong.map((dong: any) => (
                  <MenuItem key={dong.cortarNo} value={dong.cortarNo}>
                    {dong.cortarName}
                  </MenuItem>
                ))}
              </StyledSelect>
            </AddressSelectBox>
          </Box>

          {/* 카테고리/판매유형/상세필터/등록 버튼 */}
          <FilterContainer>
            <LeftButtonGroup>
              <CategoryButtonGroup>
                <StyledSelect
                  size="small"
                  value={filter.category || ""}
                  displayEmpty
                  onChange={handleCategoryChange}
                  sx={{ width: 120, height: 35 }}
                  inputProps={{ "aria-label": "카테고리" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="" sx={menuItemStyles}>
                    카테고리
                  </MenuItem>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value || ""}
                      sx={menuItemStyles}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </CategoryButtonGroup>
              <TypeButtonGroup>
                <StyledSelect
                  size="small"
                  value={filter.type || ""}
                  displayEmpty
                  onChange={handleTypeChange}
                  sx={{ width: 120, height: 35 }}
                  inputProps={{ "aria-label": "판매유형" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="" sx={menuItemStyles}>
                    판매유형
                  </MenuItem>
                  {TYPE_OPTIONS.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value || ""}
                      sx={menuItemStyles}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </TypeButtonGroup>
              <FilterButtonWrapper>
                <FilterButton
                  variant="outlined"
                  onClick={() => setFilterModalOpen(true)}
                >
                  상세 필터
                </FilterButton>
              </FilterButtonWrapper>
            </LeftButtonGroup>
            <RightButtonGroup>
              <PropertyAddButtonList fetchPropertyData={fetchPropertyData} />
            </RightButtonGroup>
          </FilterContainer>
        </TopFilterBar>

        {/* 테이블 */}
        <PropertyTable
          propertyList={privatePropertyList}
          totalElements={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          onRowClick={(property) => navigate(`/properties/${property.uid}`)}
        />

        {/* 상세 필터 모달 (카테고리/유형/주소 필드는 제외) */}
        <PropertyFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filter={filter}
          setFilter={setFilter}
          onApply={fetchFilteredProperties}
          onReset={resetFilter}
        />
      </ContentContainer>
    </PageContainer>
  );
}

export default PrivatePropertyListPage;
