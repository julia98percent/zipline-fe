import FilterListIcon from "@mui/icons-material/FilterList";
import {
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
import CircularProgress from "@components/CircularProgress";

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
}: PublicPropertyListPageViewProps) => {
  if (loading && publicPropertyList.length === 0) {
    return (
      <>
        <PageHeader />
        <div className="flex justify-center items-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </>
    );
  }

  return (
    <div className="flex-grow bg-neutral-50 min-h-screen">
      <PageHeader />

      <div className="pt-0 p-6">
        {/* 상단 필터 바 */}
        <div className="flex flex-col gap-4 p-3 mb-5 card">
          <div className="block space-y-4">
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

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  onClick={onFilterModalToggle}
                  startIcon={<FilterListIcon />}
                >
                  상세 필터
                </Button>
                <Button variant="text" onClick={onSortReset}>
                  필터 및 정렬 초기화
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

        {publicPropertyList.length > 0 ? (
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
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            검색 조건을 만족하는 매물이 없습니다.
          </div>
        )}

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
