import { SelectChangeEvent } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter } from "next/navigation";
import Select, { MenuItem } from "@/components/Select";
import RegionSelector from "@/components/RegionSelector";
import AgentPropertyTable from "./AgentPropertyTable";
import AgentPropertyFilterModal from "./AgentPropertyFilterModal";
import PropertyAddButtonList from "./PropertyAddButtonList";
import { Property } from "@/types/property";
import { Region } from "@/types/region";
import { AgentPropertySearchParams } from "@/apis/propertyService";
import Button from "@/components/Button";
import CircularProgress from "@/components/CircularProgress";

interface CategoryOption {
  value: string;
  label: string;
}

interface TypeOption {
  value: string;
  label: string;
}

interface AgentPropertyListViewProps {
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
  onFilterApply: (newFilters: Partial<AgentPropertySearchParams>) => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onFilterModalToggle: () => void;
  onFilterModalClose: () => void;
  onReset: () => void;
  onSaveProperty: () => void;
}

const AgentPropertyListView = ({
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
  onFilterApply,
  onPageChange,
  onRowsPerPageChange,
  onFilterModalToggle,
  onFilterModalClose,
  onReset,
  onSaveProperty,
}: AgentPropertyListViewProps) => {
  const router = useRouter();

  const handleRowClick = (property: Property) => {
    router.push(`/properties/agent/${property.uid}`);
  };

  if (loading) {
    return (
      <div className="flex-grow bg-neutral-50 min-h-screen">
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-neutral-50 min-h-screen">
      <div className="pt-0 p-6">
        <div className="flex flex-col gap-4 card p-3 mb-5">
          {/* 모바일 필터 레이아웃 (lg: 미만) */}
          <div className="lg:hidden space-y-4">
            {/* sm 이하: 2줄 레이아웃 */}
            <div className="block md:hidden space-y-2">
              {/* 첫 번째 줄: 시/도, 시/군/구 */}
              <div className="grid grid-cols-2 gap-2">
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
              </div>

              {/* 두 번째 줄: 동, 매물 카테고리 */}
              <div className="grid grid-cols-2 gap-2">
                <RegionSelector
                  value={selectedDong}
                  regions={dongOptions}
                  onChange={onDongChange}
                  disabled={!selectedGu}
                  label="동"
                />
                <Select
                  size="small"
                  label="카테고리"
                  value={searchParams.category || ""}
                  onChange={onCategoryChange}
                  aria-label="매물 카테고리"
                >
                  {categoryOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value || ""}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              {/* 세 번째 줄: 상세 필터, 필터 초기화 */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outlined"
                  onClick={onFilterModalToggle}
                  startIcon={<FilterListIcon />}
                >
                  상세 필터
                </Button>
                <Button variant="text" onClick={onReset} className="flex-1">
                  필터 초기화
                </Button>
              </div>
            </div>

            {/* md 이상: 기존 3개 한 줄 레이아웃 */}
            <div className="hidden md:block space-y-4">
              {/* 첫 번째 줄: 시/도, 시/군/구, 동 */}
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

              {/* 두 번째 줄: 매물 카테고리, 상세 필터, 필터 초기화 */}
              <div className="grid grid-cols-3 gap-2">
                <Select
                  size="small"
                  label="매물 카테고리"
                  value={searchParams.category || ""}
                  onChange={onCategoryChange}
                  aria-label="매물 카테고리"
                >
                  {categoryOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value || ""}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="outlined"
                  onClick={onFilterModalToggle}
                  startIcon={<FilterListIcon />}
                >
                  상세 필터
                </Button>
                <Button variant="text" onClick={onReset}>
                  필터 초기화
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <PropertyAddButtonList fetchPropertyData={onSaveProperty} />
            </div>
          </div>

          {/* 데스크톱/태블릿 필터 레이아웃 (lg 이상) */}
          <div className="hidden lg:block space-y-4">
            {/* 첫 번째 줄: 지역 선택, 카테고리 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 pr-4 border-r border-gray-300">
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

              <Select
                label="매물 카테고리"
                value={searchParams.category || ""}
                onChange={onCategoryChange}
                showEmptyOption={false}
                aria-label="매물 카테고리"
                className="min-w-36"
              >
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  onClick={onFilterModalToggle}
                  startIcon={<FilterListIcon />}
                >
                  상세 필터
                </Button>
                <Button variant="text" onClick={onReset}>
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
          typeOptions={typeOptions}
          onSidoChange={onSidoChange}
          onGuChange={onGuChange}
          onDongChange={onDongChange}
        />
      </div>
    </div>
  );
};

export default AgentPropertyListView;
