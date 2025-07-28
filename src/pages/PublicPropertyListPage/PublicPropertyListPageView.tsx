import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  CircularProgress,
  SelectChangeEvent,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PublicPropertyFilterModal from "./components/PublicPropertyFilterModal";
import { PublicPropertyTable } from "./components";
import PageHeader from "@components/PageHeader/PageHeader";
import SearchIcon from "@mui/icons-material/Search";
import IOSSwitch from "@components/Switch";
import { PublicPropertyItem, PublicPropertySearchParams } from "@ts/property";
import Button from "@components/Button";

interface PublicPropertyListPageViewProps {
  loading: boolean;
  publicPropertyList: PublicPropertyItem[];
  hasNext: boolean;
  searchAddress: string;
  selectedSido: string;
  selectedGu: string;
  selectedDong: string;
  useMetric: boolean;
  showFilterModal: boolean;
  searchParams: PublicPropertySearchParams;
  onSidoChange: (event: SelectChangeEvent<string>) => void;
  onGuChange: (event: SelectChangeEvent<string>) => void;
  onDongChange: (event: SelectChangeEvent<string>) => void;
  onFilterApply: (newFilters: Partial<PublicPropertySearchParams>) => void;
  onSort: (field: string) => void;
  onSortReset: () => void;
  onAddressSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressSearchSubmit: () => void;
  onLoadMore: () => void;
  onMetricToggle: () => void;
  onFilterModalToggle: () => void;
  onFilterModalClose: () => void;
  onMobileMenuToggle?: () => void;
}

const PublicPropertyListPageView = ({
  loading,
  publicPropertyList,
  hasNext,
  searchAddress,
  selectedSido,
  selectedGu,
  selectedDong,
  useMetric,
  showFilterModal,
  searchParams,
  onSidoChange,
  onGuChange,
  onDongChange,
  onFilterApply,
  onSort,
  onSortReset,
  onAddressSearch,
  onAddressSearchSubmit,
  onLoadMore,
  onMetricToggle,
  onFilterModalToggle,
  onFilterModalClose,
  onMobileMenuToggle,
}: PublicPropertyListPageViewProps) => {
  if (loading && publicPropertyList.length === 0) {
    return (
      <>
        <PageHeader
          title="공개 매물 목록"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <Box className="flex justify-center items-center h-screen pt-20">
          <CircularProgress color="primary" />
        </Box>
      </>
    );
  }

  return (
    <div className="flex-grow bg-gray-100 min-h-screen">
      <PageHeader
        title="공개 매물 목록"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      <div className="p-5">
        {/* 상단 필터 바 */}
        <div className="flex flex-col gap-4 bg-white rounded-lg p-3 shadow-sm mb-5">
          {/* 모바일 필터 레이아웃 (md 미만) */}
          <div className="lg:hidden space-y-3">
            {/* 주소 검색 */}
            <TextField
              fullWidth
              size="small"
              placeholder="주소 검색 (예: 강남구, 도산대로)"
              value={searchAddress}
              onChange={onAddressSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddressSearchSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={onAddressSearchSubmit}>
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="flex gap-2">
              <Button
                variant="outlined"
                onClick={onFilterModalToggle}
                className="text-sm px-3 py-2"
              >
                <FilterListIcon className="mr-1 text-sm" />
                상세 필터
              </Button>
              <Button
                variant="text"
                onClick={onSortReset}
                className="text-sm px-3 py-2"
              >
                필터 초기화
              </Button>
            </div>
          </div>

          {/* 데스크톱/태블릿 필터 레이아웃 (md 이상) */}
          <div className="hidden lg:block space-y-4">
            {/* 첫 번째 줄: 주소 검색 */}
            <div className="flex items-center gap-2">
              <TextField
                fullWidth
                size="small"
                placeholder="주소 검색 (예: 강남구, 도산대로)"
                value={searchAddress}
                onChange={onAddressSearch}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddressSearchSubmit();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={onAddressSearchSubmit}>
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* 두 번째 줄: 필터 초기화, 상세 필터 */}
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
                <Button
                  variant="text"
                  onClick={onSortReset}
                  className="min-w-10"
                >
                  필터 초기화
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 단위 스위치 */}
        <div className="flex items-center mb-5">
          <FormControlLabel
            control={
              <IOSSwitch
                className="ml-4 mr-2"
                checked={useMetric}
                onChange={onMetricToggle}
                color="primary"
                size="small"
              />
            }
            label={useMetric ? "제곱미터(m²)" : "평(py)"}
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
          />
        </div>

        <PublicPropertyTable
          propertyList={publicPropertyList}
          hasMore={hasNext}
          isLoading={loading}
          loadMore={onLoadMore}
          onSort={onSort}
          sortField={
            searchParams && "sortField" in searchParams
              ? searchParams.sortField
              : undefined
          }
          isAscending={
            searchParams && "isAscending" in searchParams
              ? searchParams.isAscending
              : undefined
          }
          useMetric={useMetric}
        />

        <PublicPropertyFilterModal
          open={showFilterModal}
          onClose={onFilterModalClose}
          onApply={onFilterApply}
          filters={searchParams}
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

export default PublicPropertyListPageView;
