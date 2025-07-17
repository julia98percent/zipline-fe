import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@components/TextField";
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
        <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
          <div className="flex justify-end items-center gap-2">
            <TextField
              placeholder="전화번호 또는 고객이름으로 검색"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              size="small"
              startAdornment={<SearchIcon />}
              className="min-w-[300px]"
            />
            <Button
              text="상세 필터"
              variant="outlined"
              onClick={onFilterModalOpen}
              className="h-10 ml-2 min-w-[120px] border border-[#164F9E] text-[#164F9E] rounded-full hover:border-[#164F9E]"
              startIcon={<FilterListIcon />}
            />
          </div>
          <div className="flex justify-start items-center">
            <CustomerAddButtonList fetchCustomerData={onCustomerCreate} />
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
