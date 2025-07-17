import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Customer, Label, CustomerRoleFilters } from "@ts/customer";
import { RegionState } from "@ts/region";
import { CustomerList, CustomerFilters } from "../../components";
import { CustomerTabsSection, CustomerPaginationSection } from "./components";

interface CustomerSelectModalViewProps {
  open: boolean;
  onClose: () => void;
  selectedTab: number;
  totalCount: number;
  selectedCustomers: Customer[];
  currentPageCustomers: Customer[];
  page: number;
  rowsPerPage: number;
  loading: boolean;
  search: string;
  region: RegionState;
  roleFilters: CustomerRoleFilters;
  labelUids: number[];
  labels: Label[];
  onTabChange: (newValue: number) => void;
  onCustomerSelect: (customer: Customer) => void;
  onConfirm: () => void;
  onSearchChange: (search: string) => void;
  onRegionChange: (
    type: "sido" | "sigungu" | "dong"
  ) => (event: SelectChangeEvent<number>) => void;
  onRoleFilterChange: (role: string) => void;
  onLabelFilterChange: (labelUid: number) => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomerSelectModalView({
  open,
  onClose,
  selectedTab,
  totalCount,
  selectedCustomers,
  currentPageCustomers,
  page,
  rowsPerPage,
  loading,
  search,
  region,
  roleFilters,
  labelUids,
  labels,
  onTabChange,
  onCustomerSelect,
  onConfirm,
  onSearchChange,
  onRegionChange,
  onRoleFilterChange,
  onLabelFilterChange,
  onChangePage,
  onChangeRowsPerPage,
}: CustomerSelectModalViewProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          단체 문자 발송 대상 선택
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 0 }}>
        <CustomerFilters
          search={search}
          region={region}
          roleFilters={roleFilters}
          labelUids={labelUids}
          labels={labels}
          onSearchChange={onSearchChange}
          onRegionChange={onRegionChange}
          onRoleFilterChange={onRoleFilterChange}
          onLabelFilterChange={onLabelFilterChange}
        />

        <CustomerTabsSection
          selectedTab={selectedTab}
          totalCount={totalCount}
          selectedCustomersCount={selectedCustomers.length}
          onTabChange={onTabChange}
        />

        <CustomerList
          customers={currentPageCustomers}
          selectedCustomers={selectedCustomers}
          loading={loading}
          onCustomerSelect={onCustomerSelect}
        />

        <CustomerPaginationSection
          count={selectedTab === 0 ? totalCount : selectedCustomers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#666666",
            color: "#666666",
            "&:hover": {
              borderColor: "#333333",
              backgroundColor: "rgba(102, 102, 102, 0.04)",
            },
          }}
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#164F9E",
            "&:hover": {
              backgroundColor: "#0D3B7A",
            },
          }}
        >
          확인 ({selectedCustomers.length}명)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
