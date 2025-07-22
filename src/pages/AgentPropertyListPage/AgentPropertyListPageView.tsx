import { CircularProgress, SelectChangeEvent, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import PageHeader from "@components/PageHeader/PageHeader";
import Select, { MenuItem } from "@components/Select";
import RegionSelector from "@components/RegionSelector";
import { AgentPropertyTable, AgentPropertyFilterModal } from "./components";
import PropertyAddButtonList from "./components/PropertyAddButtonList/PropertyAddButtonList";
import { Property } from "@ts/property";
import { Region } from "@ts/region";
import { AgentPropertySearchParams } from "@apis/propertyService";
import Button from "@components/Button";

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
  onSidoChange: (event: SelectChangeEvent<number>) => void;
  onGuChange: (event: SelectChangeEvent<number>) => void;
  onDongChange: (event: SelectChangeEvent<number>) => void;
  onCategoryChange: (event: SelectChangeEvent<unknown>) => void;
  onTypeChange: (event: SelectChangeEvent<unknown>) => void;
  onFilterApply: (newFilters: Partial<AgentPropertySearchParams>) => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onFilterModalToggle: () => void;
  onFilterModalClose: () => void;
  onRefresh: () => void;
  onSaveProperty: () => void;
  onMobileMenuToggle?: () => void;
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
  onSaveProperty,
  onMobileMenuToggle,
}: AgentPropertyListPageViewProps) => {
  const navigate = useNavigate();

  const handleRowClick = (property: Property) => {
    navigate(`/properties/${property.uid}`);
  };

  if (loading) {
    return (
      <div className="flex-grow bg-gray-100 min-h-screen">
        <PageHeader
          title="개인 매물 목록"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <div className="flex justify-center p-6">
          <CircularProgress color="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-100 min-h-screen">
      <PageHeader
        title="개인 매물 목록"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      <div className="p-5">
        {/* 상단 필터 바 */}
        <div className="flex flex-col gap-4 bg-white rounded-lg p-3 shadow-sm mb-5">
          {/* 모바일 필터 레이아웃 (md 미만) */}
          <div className="md:hidden space-y-3">
            {/* 첫 번째 줄: 주소 선택 (시/도, 시/군/구, 동) */}
            <div className="grid grid-cols-3 gap-2">
              <RegionSelector
                label="시/도"
                value={selectedSido}
                regions={regions}
                onChange={onSidoChange}
              />
              <RegionSelector
                value={selectedGu}
                regions={sigunguOptions}
                onChange={onGuChange}
                disabled={!selectedSido}
                label="시/군/구"
              />
              <RegionSelector
                value={selectedDong}
                regions={dongOptions}
                onChange={onDongChange}
                disabled={!selectedGu}
                label="동"
              />
            </div>

            {/* 두 번째 줄: 카테고리, 판매유형, 상세필터 */}
            <div className="grid grid-cols-3 gap-2">
              <Select
                size="small"
                value={searchParams.category || ""}
                onChange={onCategoryChange}
                displayEmpty
                showEmptyOption={false}
                aria-label="카테고리"
              >
                <MenuItem value="">아파트</MenuItem>
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              <Select
                size="small"
                value={searchParams.type || ""}
                onChange={onTypeChange}
                displayEmpty
                showEmptyOption={false}
                aria-label="판매유형"
              >
                <MenuItem value="">판매유형</MenuItem>
                {typeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="outlined"
                onClick={onFilterModalToggle}
                className="text-sm px-3 py-2"
              >
                <FilterListIcon className="mr-1 text-sm" />
                상세 필터
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <PropertyAddButtonList fetchPropertyData={onSaveProperty} />
              </div>
              <IconButton
                onClick={onRefresh}
                className="border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 p-3 min-w-[48px]"
                aria-label="새로고침"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          {/* 데스크톱/태블릿 필터 레이아웃 (md 이상) */}
          <div className="hidden md:block space-y-4">
            {/* 첫 번째 줄: 지역 선택, 카테고리, 판매유형 */}
            <div className="flex items-center gap-2">
              <RegionSelector
                label="시/도"
                value={selectedSido}
                regions={regions}
                onChange={onSidoChange}
              />

              <RegionSelector
                value={selectedGu}
                regions={sigunguOptions}
                onChange={onGuChange}
                disabled={!selectedSido}
                label="시/군/구"
              />

              <RegionSelector
                value={selectedDong}
                regions={dongOptions}
                onChange={onDongChange}
                disabled={!selectedGu}
                label="동"
              />

              <Select
                size="small"
                value={searchParams.category || ""}
                onChange={onCategoryChange}
                displayEmpty
                showEmptyOption={false}
                aria-label="카테고리"
              >
                <MenuItem value="">카테고리</MenuItem>
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>

              <Select
                size="small"
                value={searchParams.type || ""}
                onChange={onTypeChange}
                displayEmpty
                showEmptyOption={false}
                aria-label="판매유형"
              >
                <MenuItem value="">판매유형</MenuItem>
                {typeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* 두 번째 줄: 필터 초기화, 상세 필터, 매물 등록 버튼들 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  onClick={onFilterModalToggle}
                  className="min-w-10 px-3 rounded-3xl"
                >
                  <FilterListIcon className="mr-2" />
                  상세 필터
                </Button>
                <Button variant="text" onClick={onRefresh} className="min-w-10">
                  필터 초기화
                </Button>
              </div>
              <PropertyAddButtonList fetchPropertyData={onSaveProperty} />
            </div>
          </div>
        </div>

        {/* 매물 개수 표시 */}
        <div className="px-2 mb-5 text-sm text-gray-700 font-medium">
          총 {totalElements.toLocaleString()}개
        </div>

        {/* 테이블 */}
        <AgentPropertyTable
          propertyList={agentPropertyList}
          totalElements={totalElements}
          totalPages={Math.ceil(totalElements / searchParams.size)}
          page={searchParams.page}
          rowsPerPage={searchParams.size}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
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
      </div>
    </div>
  );
};

export default AgentPropertyListPageView;
