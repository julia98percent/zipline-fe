import { Box, CircularProgress, TextField, Button } from "@mui/material";
import { InputAdornment } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
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
  onFilterApply: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onCustomerUpdate: (customer: Customer) => void;
  onRefresh: () => void;
  onCustomerCreate: () => void;
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
}: CustomerListPageViewProps) => {
  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 64px)",
          overflow: "auto",
          width: "calc(100% - 240px)",
          ml: "240px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#f5f5f5",
        maxWidth: { xs: "100%", md: "calc(100vw - 240px)" },
        boxSizing: "border-box",
      }}
    >
      <PageHeader title="고객 목록" />

      <Box
        sx={{
          p: "20px",
          maxWidth: "100%",
          mx: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            padding: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              placeholder="전화번호 또는 고객이름으로 검색"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.25)",
                  },
                },
              }}
            />
            <Button
              startIcon={<FilterListIcon />}
              onClick={onFilterModalOpen}
              sx={{
                height: "40px",
                ml: 1,
                minWidth: "120px",
                border: "1px solid #164F9E",
                color: "#164F9E",
                borderRadius: "20px",
                "&:hover": {
                  border: "1px solid #164F9E",
                },
              }}
            >
              상세 필터
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <CustomerAddButtonList fetchCustomerData={onCustomerCreate} />
          </Box>
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
      </Box>
    </Box>
  );
};

export default CustomerListPageView;
