import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  SelectChangeEvent,
  Typography,
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            paddingTop: "80px",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="공개 매물 목록"
        onMobileMenuToggle={onMobileMenuToggle}
      />
      <Box
        sx={{
          padding: "20px",
          paddingTop: "20px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {/* 상단 필터 바 컨테이너 */}
        <Paper
          sx={{
            p: 3,
            mb: "28px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={onSortReset}
              sx={{ height: "32px" }}
            >
              필터 초기화
            </Button>
            <Button
              startIcon={<FilterListIcon />}
              color={showFilterModal ? "primary" : "inherit"}
              variant={showFilterModal ? "contained" : "outlined"}
              onClick={onFilterModalToggle}
              sx={{ height: "32px", ml: 1 }}
            >
              상세 필터
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          </Box>
        </Paper>

        {/* 단위/주소 스위치: 두 컨테이너 사이로 이동 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: "3px",
            mt: "5px",
            ml: "8px",
          }}
        >
          <FormControlLabel
            control={
              <IOSSwitch
                checked={useMetric}
                onChange={onMetricToggle}
                color="primary"
                size="small"
              />
            }
            label={useMetric ? "제곱미터(m²)" : "평(py)"}
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
          />
        </Box>

        {/* 매물 리스트 컨테이너 */}
        <Paper
          sx={{
            p: 3,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
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
        </Paper>

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
      </Box>
    </>
  );
};

export default PublicPropertyListPageView;
