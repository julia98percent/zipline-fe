import {
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
import Button from "@components/Button";

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
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        문자 발송 대상 고객 선택
      </DialogTitle>

      <DialogContent className="mt-4 p-7 pt-0">
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

      <DialogActions className="flex items-center justify-end p-6 border-t border-gray-200">
        <Button onClick={onClose} variant="outlined" color="info">
          취소
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          확인 ({selectedCustomers.length}명)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
