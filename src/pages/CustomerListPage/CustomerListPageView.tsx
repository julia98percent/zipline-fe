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
  legalDistrictCode: string;
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
          <div className="flex flex-col gap-4">
            <TextField
              fullWidth
              size="small"
              placeholder="전화번호 또는 고객 이름으로 검색"
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

            <div className="flex items-center justify-between gap-2">
              <div>
                <Button
                  variant="outlined"
                  onClick={onFilterModalOpen}
                  startIcon={<FilterListIcon />}
                >
                  상세 필터
                </Button>
                <Button
                  variant="text"
                  onClick={onFilterReset}
                  className="min-w-10"
                >
                  필터 초기화
                </Button>
              </div>
              <CustomerAddButtonList fetchCustomerData={onCustomerCreate} />
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
