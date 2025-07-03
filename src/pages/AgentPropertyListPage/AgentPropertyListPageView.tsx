import { CircularProgress, MenuItem, SelectChangeEvent } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "@components/PageHeader/PageHeader";
import { AgentPropertyTable, AgentPropertyFilterModal } from "./components";
import PropertyAddModal from "./components/PropertyAddButtonList/PropertyAddModal/PropertyAddModal";
import { Property } from "@ts/property";
import { Region } from "@ts/region";
import { AgentPropertySearchParams } from "@apis/propertyService";
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

interface CategoryOption {
  value: string;
  label: string;
}

interface TypeOption {
  value: string;
  label: string;
}

interface AgentPropertyListPageViewProps {
  loading: boolean;
  agentPropertyList: Property[];
  totalElements: number;
  searchParams: AgentPropertySearchParams;
  showFilterModal: boolean;
  regions: Region[];
  selectedSido: string;
  selectedGu: string;
  selectedDong: string;
  categoryOptions: CategoryOption[];
  typeOptions: TypeOption[];
  sigunguOptions: Region[];
  dongOptions: Region[];
  onSidoChange: (event: SelectChangeEvent) => void;
  onGuChange: (event: SelectChangeEvent) => void;
  onDongChange: (event: SelectChangeEvent) => void;
  onCategoryChange: (event: SelectChangeEvent<unknown>) => void;
  onTypeChange: (event: SelectChangeEvent<unknown>) => void;
  onFilterApply: (newFilters: Partial<AgentPropertySearchParams>) => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onFilterModalToggle: () => void;
  onFilterModalClose: () => void;
  onRefresh: () => void;
  onAddProperty?: () => void;
  showAddPropertyModal: boolean;
  onCloseAddPropertyModal: () => void;
  onSaveProperty: () => void;
}

const AgentPropertyListPageView = ({
  loading,
  agentPropertyList,
  totalElements,
  searchParams,
  showFilterModal,
  regions,
  selectedSido,
  selectedGu,
  selectedDong,
  categoryOptions,
  typeOptions,
  sigunguOptions,
  dongOptions,
  onSidoChange,
  onGuChange,
  onDongChange,
  onCategoryChange,
  onTypeChange,
  onFilterApply,
  onPageChange,
  onRowsPerPageChange,
  onFilterModalToggle,
  onFilterModalClose,
  onRefresh,
  onAddProperty,
  showAddPropertyModal,
  onCloseAddPropertyModal,
  onSaveProperty,
}: AgentPropertyListPageViewProps) => {
  const navigate = useNavigate();

  const handleRowClick = (property: Property) => {
    navigate(`/properties/${property.uid}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="개인 매물 목록" />
        <LoadingContainer>
          <CircularProgress color="primary" />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ minWidth: "800px" }}>
      <PageHeader title="개인 매물 목록" />

      <ContentContainer>
        {/* 상단 필터 바 */}
        <TopFilterBar>
          {/* 주소 선택 (시/도/구/군/동) */}
          <Box sx={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AddressSelectBox
              sx={{ background: "#fff", boxShadow: "none", padding: 0 }}
            >
              <StyledSelect
                size="small"
                value={selectedSido}
                displayEmpty
                onChange={(event) => onSidoChange(event as SelectChangeEvent)}
                sx={{ width: 120, height: 35 }}
              >
                <MenuItem value="">시/도</MenuItem>
                {regions.map((sido: Region) => (
                  <MenuItem key={sido.cortarNo} value={sido.cortarNo}>
                    {sido.cortarName}
                  </MenuItem>
                ))}
              </StyledSelect>

              <StyledSelect
                size="small"
                value={selectedGu}
                displayEmpty
                onChange={(event) => onGuChange(event as SelectChangeEvent)}
                sx={{ width: 120, height: 35 }}
                disabled={!selectedSido}
              >
                <MenuItem value="">시/군/구</MenuItem>
                {sigunguOptions.map((gu: Region) => (
                  <MenuItem key={gu.cortarNo} value={gu.cortarNo}>
                    {gu.cortarName}
                  </MenuItem>
                ))}
              </StyledSelect>

              <StyledSelect
                size="small"
                value={selectedDong}
                displayEmpty
                onChange={(event) => onDongChange(event as SelectChangeEvent)}
                sx={{ width: 120, height: 35 }}
                disabled={!selectedGu}
              >
                <MenuItem value="">동</MenuItem>
                {dongOptions.map((dong: Region) => (
                  <MenuItem key={dong.cortarNo} value={dong.cortarNo}>
                    {dong.cortarName}
                  </MenuItem>
                ))}
              </StyledSelect>
            </AddressSelectBox>
          </Box>

          {/* 카테고리/판매유형/상세필터/새로고침 버튼 */}
          <FilterContainer>
            <LeftButtonGroup sx={{ gap: 1 }}>
              <CategoryButtonGroup>
                <StyledSelect
                  size="small"
                  value={searchParams.category || ""}
                  displayEmpty
                  onChange={onCategoryChange}
                  sx={{ width: 120, height: 35 }}
                  inputProps={{ "aria-label": "카테고리" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="" sx={menuItemStyles}>
                    카테고리
                  </MenuItem>
                  {categoryOptions.map((opt) => (
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
                  value={searchParams.type || ""}
                  displayEmpty
                  onChange={onTypeChange}
                  sx={{ width: 120, height: 35 }}
                  inputProps={{ "aria-label": "판매유형" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="" sx={menuItemStyles}>
                    판매유형
                  </MenuItem>
                  {typeOptions.map((opt) => (
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
                  onClick={onFilterModalToggle}
                  sx={{
                    border: "1px solid #164F9E",
                    color: "#164F9E",
                    minWidth: "40px",
                    padding: "5px",
                    borderRadius: "20px",
                    width: "117px",
                    "&:hover": {
                      backgroundColor: "#F5F5F5",
                      border: "1px solid #164F9E",
                    },
                  }}
                >
                  <FilterListIcon sx={{ mr: "8px" }} />
                  상세 필터
                </FilterButton>
              </FilterButtonWrapper>
            </LeftButtonGroup>
            <RightButtonGroup>
              {onAddProperty && (
                <FilterButton
                  variant="contained"
                  onClick={onAddProperty}
                  sx={{
                    backgroundColor: "#164F9E",
                    color: "white",
                    minWidth: "40px",
                    padding: "5px",
                    borderRadius: "20px",
                    width: "100px",
                    marginRight: "10px",
                    "&:hover": {
                      backgroundColor: "#123d7a",
                    },
                  }}
                >
                  매물 추가
                </FilterButton>
              )}
              <FilterButton
                variant="outlined"
                onClick={onRefresh}
                sx={{
                  border: "1px solid #164F9E",
                  color: "#164F9E",
                  minWidth: "40px",
                  padding: "5px",
                  borderRadius: "20px",
                  width: "100px",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                    border: "1px solid #164F9E",
                  },
                }}
              >
                새로고침
              </FilterButton>
            </RightButtonGroup>
          </FilterContainer>
        </TopFilterBar>

        {/* 테이블 */}
        <AgentPropertyTable
          propertyList={agentPropertyList}
          totalElements={totalElements}
          totalPages={Math.ceil(totalElements / searchParams.size)}
          page={searchParams.page}
          rowsPerPage={searchParams.size}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          useMetric={false}
          onRowClick={handleRowClick}
        />

        {/* 상세 필터 모달 */}
        <AgentPropertyFilterModal
          open={showFilterModal}
          onClose={onFilterModalClose}
          onApply={onFilterApply}
          filters={searchParams}
          regions={regions}
          selectedSido={selectedSido}
          selectedGu={selectedGu}
          selectedDong={selectedDong}
          onSidoChange={onSidoChange}
          onGuChange={onGuChange}
          onDongChange={onDongChange}
        />

        {/* 매물 추가 모달 */}
        <PropertyAddModal
          open={showAddPropertyModal}
          handleClose={onCloseAddPropertyModal}
          fetchPropertyData={onSaveProperty}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default AgentPropertyListPageView;
