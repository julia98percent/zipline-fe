import { useEffect, useState, useCallback } from "react";
import apiClient from "@apis/apiClient";
// import PropertyAddButtonList from "./PropertyAddButtonList"; // 사용하지 않으므로 주석 처리 또는 삭제
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
  ActionButtonWrapper,
  FilterButton,
  LoadingContainer,
  TopFilterBar,
  AddressSelectBox,
  CategoryButtonGroup,
  TypeButtonGroup,
  StyledSelect,
} from "./styles/PrivatePropertyListPage.styles";
import { MenuItem, SelectChangeEvent } from "@mui/material";
import PropertyAddButtonList from "./PropertyAddButtonList";
import { Box } from "@mui/material";

export interface PropertyItem {
  uid: number;
  customerName: string;
  address: string;
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

// 카테고리/유형 옵션
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

function PrivatePropertyListPage() {
  const [privatePropertyList, setPrivatePropertyList] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<AgentPropertyFilterRequest>({});
  const { user } = useUserStore();

  // 주소 선택 state (예시)
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  // 카테고리/유형 필터 핸들러
  const handleCategoryChange = (e: SelectChangeEvent<unknown>) => {
    const value = (e.target.value as string) === "" ? undefined : e.target.value as PropertyItem["realCategory"];
    setFilter((prev) => ({ ...prev, category: value }));
  };
  const handleTypeChange = (e: SelectChangeEvent<unknown>) => {
    const value = (e.target.value as string) === "" ? undefined : e.target.value as PropertyItem["type"];
    setFilter((prev) => ({ ...prev, type: value }));
  };

  // 주소 선택 핸들러 (실제 데이터 연동은 추후)
  const handleSidoChange = (e: SelectChangeEvent<unknown>) => {
    setSelectedSido(e.target.value as string);
    setSelectedGu("");
    setSelectedDong("");
    setFilter((prev) => ({ ...prev, legalDistrictCode: undefined }));
  };
  const handleGuChange = (e: SelectChangeEvent<unknown>) => {
    setSelectedGu(e.target.value as string);
    setSelectedDong("");
    setFilter((prev) => ({ ...prev, legalDistrictCode: undefined }));
  };
  const handleDongChange = (e: SelectChangeEvent<unknown>) => {
    setSelectedDong(e.target.value as string);
    setFilter((prev) => ({ ...prev, legalDistrictCode: (e.target.value as string) === "삼성동" ? "1168010800" : undefined }));
  };

  const fetchPropertyData = useCallback(() => {
    setLoading(true);
    apiClient
      .get("/properties")
      .then((res) => {
        const agentPropertyData = res?.data?.data?.agentProperty;
        setPrivatePropertyList(agentPropertyData || []);
      })
      .catch((error) => {
        console.error("Failed to fetch properties:", error);
        setPrivatePropertyList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchFilteredProperties = useCallback(() => {
    setLoading(true);
    apiClient
      .get("/properties", {
        params: {
          ...filter,
          page: 0,
          size: 10,
        },
      })
      .then((res) => {
        const agentPropertyData = res?.data?.data?.agentProperty;
        setPrivatePropertyList(agentPropertyData || []);
      })
      .catch((error) => {
        console.error("Failed to fetch filtered properties:", error);
        setPrivatePropertyList([]);
      })
      .finally(() => {
        setLoading(false);
        setFilterModalOpen(false);
      });
  }, [filter]);

  // 바깥 필터가 바뀔 때마다 자동으로 리스트 조회
  useEffect(() => {
    // 카테고리, 유형, legalDistrictCode 중 하나라도 바뀌면
    fetchFilteredProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.category, filter.type, filter.legalDistrictCode]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

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
          {/* 주소 체크 (시/군/구/동) - 두 줄로 자연스럽게 */}
          <Box sx={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 1 }}>
            <AddressSelectBox sx={{ background: '#fff', boxShadow: 'none', padding: 0 }}>
              <StyledSelect
                size="small"
                value={selectedSido}
                displayEmpty
                onChange={handleSidoChange}
                sx={{ width: 120, marginRight: 1 }}
                inputProps={{ 'aria-label': '시/도' }}
              >
                <MenuItem value="">시/도</MenuItem>
                <MenuItem value="서울시">서울시</MenuItem>
                {/* 실제 시/도 데이터로 대체 */}
              </StyledSelect>
              <StyledSelect
                size="small"
                value={selectedGu}
                displayEmpty
                onChange={handleGuChange}
                sx={{ width: 120, marginRight: 1 }}
                inputProps={{ 'aria-label': '구/군' }}
              >
                <MenuItem value="">구/군</MenuItem>
                <MenuItem value="강남구">강남구</MenuItem>
                {/* 실제 구/군 데이터로 대체 */}
              </StyledSelect>
              <StyledSelect
                size="small"
                value={selectedDong}
                displayEmpty
                onChange={handleDongChange}
                sx={{ width: 120,  marginRight: 1 }}
                inputProps={{ 'aria-label': '동' }}
              >
                <MenuItem value="">동</MenuItem>
                <MenuItem value="삼성동">삼성동</MenuItem>
                {/* 실제 동 데이터로 대체 */}
              </StyledSelect>
            </AddressSelectBox>
          </Box>

          {/* 카테고리/판매유형/상세필터/등록 버튼 한 줄 */}
          <Box sx={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <CategoryButtonGroup>
              <StyledSelect
                size="small"
                value={filter.category || ""}
                displayEmpty
                onChange={handleCategoryChange}
                sx={{ width: 120 }}
                inputProps={{ 'aria-label': '카테고리' }}
              >
                <MenuItem value="">카테고리</MenuItem>
                {CATEGORY_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>{opt.label}</MenuItem>
                ))}
              </StyledSelect>
            </CategoryButtonGroup>
            <TypeButtonGroup>
              <StyledSelect
                size="small"
                value={filter.type || ""}
                displayEmpty
                onChange={handleTypeChange}
                sx={{ width: 120 }}
                inputProps={{ 'aria-label': '판매유형' }}
              >
                <MenuItem value="">판매유형</MenuItem>
                {TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>{opt.label}</MenuItem>
                ))}
              </StyledSelect>
            </TypeButtonGroup>
            <FilterButtonWrapper>
              <FilterButton variant="outlined" onClick={() => setFilterModalOpen(true)}>
                상세 필터
              </FilterButton>
            </FilterButtonWrapper>
            <ActionButtonWrapper>
              <PropertyAddButtonList fetchPropertyData={fetchPropertyData} />
            </ActionButtonWrapper>
          </Box>
        </TopFilterBar>

        {/* 테이블 */}
        <PropertyTable propertyList={privatePropertyList} />

        {/* 상세 필터 모달 (카테고리/유형/주소 필드는 제외) */}
        <PropertyFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filter={filter}
          setFilter={setFilter}
          onApply={fetchFilteredProperties}
          onReset={() => setFilter({})}
        />
      </ContentContainer>
    </PageContainer>
  );
}

export default PrivatePropertyListPage;
