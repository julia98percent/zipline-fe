import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Button from "@components/Button";
import PageHeader from "@components/PageHeader/PageHeader";
import CustomerTable from "./CustomerTable/CustomerTable";
import CustomerAddButtonList from "./CustomerAddButtonList";
import CustomerFilterModal from "./CustomerFilterModal/CustomerFilterModal";
import { Customer } from "@ts/customer";

interface Filters {
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  minRent: number | null;
  maxRent: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  labelUids: number[];
  telProvider: string;
  preferredRegion: string;
  trafficSource: string;
  noRole: boolean;
}

interface CustomerListPageViewProps {
  loading: boolean;
  customerList: Customer[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  searchTerm: string;
  filterModalOpen: boolean;
  filters: Filters;
  onSearchChange: (searchTerm: string) => void;
  onFilterModalOpen: () => void;
  onFilterModalClose: () => void;
  onFiltersChange: (filters: Filters) => void;
  onFilterApply: (filters: Filters) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onCustomerUpdate: (customer: Customer) => void;
  onRefresh: () => void;
  onCustomerCreate: () => void;
  onSearchSubmit: () => void;
  onFilterReset: () => void;
  onMobileMenuToggle?: () => void;
}

const CustomerListPageView = ({
  loading,
  customerList,
  totalCount,
  page,
  rowsPerPage,
  searchTerm,
  filterModalOpen,
  filters,
  onSearchChange,
  onFilterModalOpen,
  onFilterModalClose,
  onFiltersChange,
  onFilterApply,
  onPageChange,
  onRowsPerPageChange,
  onCustomerUpdate,
  onRefresh,
  onCustomerCreate,
  onSearchSubmit,
  onFilterReset,
  onMobileMenuToggle,
}: CustomerListPageViewProps) => {
  if (loading) {
    return (
      <div className="flex-grow h-[calc(100vh-64px)] overflow-auto ml-60 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow h-screen overflow-auto bg-gray-100 max-w-full box-border">
      <PageHeader title="고객 목록" onMobileMenuToggle={onMobileMenuToggle} />

      <div className="p-5 max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex flex-col sm:gap-4">
            {/* 작은/중간 화면 레이아웃 */}
            <div className="sm:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-2 mb-4">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="전화번호 / 고객 이름으로 검색"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSearchSubmit();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={onSearchSubmit}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="flex justify-between sm:justify-end gap-1 sm:gap-2 text-wrap">
                  <Button
                    variant="outlined"
                    onClick={onFilterModalOpen}
                    startIcon={<FilterListIcon />}
                    className="w-[50%] sm:w-fit"
                  >
                    상세 필터
                  </Button>
                  <Button
                    variant="text"
                    className="w-[50%] sm:w-fit sm:p-1!"
                    onClick={onFilterReset}
                  >
                    필터 초기화
                  </Button>
                </div>
              </div>
              <CustomerAddButtonList fetchCustomerData={onCustomerCreate} />
            </div>

            {/* 큰 화면 레이아웃 */}
            <div className="hidden sm:block">
              {/* 첫 번째 줄: 검색창만 */}
              <div className="mb-4">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="전화번호 / 고객 이름으로 검색"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSearchSubmit();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={onSearchSubmit}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* 두 번째 줄: 고객 등록 버튼들 + 필터 버튼들 */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    onClick={onFilterModalOpen}
                    startIcon={<FilterListIcon />}
                  >
                    상세 필터
                  </Button>
                  <Button variant="text" onClick={onFilterReset}>
                    필터 초기화
                  </Button>
                </div>
                <CustomerAddButtonList fetchCustomerData={onCustomerCreate} />
              </div>
            </div>
          </div>
        </div>
        <CustomerTable
          customerList={customerList}
          totalCount={totalCount}
          setPage={onPageChange}
          setRowsPerPage={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          onCustomerUpdate={onCustomerUpdate}
          onRefresh={onRefresh}
        />

        <CustomerFilterModal
          open={filterModalOpen}
          onClose={onFilterModalClose}
          filters={filters}
          setFilters={onFiltersChange}
          onApply={onFilterApply}
        />
      </div>
    </div>
  );
};

export default CustomerListPageView;
