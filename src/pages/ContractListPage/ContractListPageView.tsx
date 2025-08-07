import ContractTable from "./ContractTable";
import ContractFilterModal from "./ContractFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import Select from "@components/Select";
import ContractAddModal from "./ContractAddButtonList/ContractAddModal";
import Button from "@components/Button";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  TextField as MuiTextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Contract } from "@ts/contract";

interface ContractListPageViewProps {
  contractList: Contract[];
  selectedPeriod: string | null;
  selectedStatus: string;
  filterModalOpen: boolean;
  searchKeyword: string;
  selectedSort: string;
  isAddModalOpen: boolean;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  CONTRACT_STATUS_OPTION_LIST: Array<{ value: string; label: string }>;
  periodMapping: Record<string, string>;
  sortOptions: Array<{ value: string; label: string }>;
  onSortChange: (value: string) => void;
  onSearchKeywordChange: (keyword: string) => void;
  onSearchSubmit: () => void;
  onStatusChange: (status: string) => void;
  onPeriodClick: (label: string) => void;
  onAddModalOpen: () => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (contract: Contract) => void;
  onFilterModalClose: () => void;
  onFilterApply: (filter: { period: string; status: string }) => void;
  onAddModalClose: () => void;
  onRefreshData: () => void;
  onMobileMenuToggle?: () => void;
  handleClearFilters: () => void;
}

const ContractListPageView = ({
  contractList,
  selectedPeriod,
  selectedStatus,
  filterModalOpen,
  searchKeyword,
  selectedSort,
  isAddModalOpen,
  page,
  rowsPerPage,
  totalElements,
  CONTRACT_STATUS_OPTION_LIST,
  periodMapping,
  sortOptions,
  onSortChange,
  onSearchKeywordChange,
  onSearchSubmit,
  onStatusChange,
  onPeriodClick,
  onAddModalOpen,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  onFilterModalClose,
  onFilterApply,
  onAddModalClose,
  onRefreshData,
  onMobileMenuToggle,
  handleClearFilters,
}: ContractListPageViewProps) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <PageHeader title="계약 목록" onMobileMenuToggle={onMobileMenuToggle} />

      <div className="p-5">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
          <div className="flex gap-3 items-center mb-5">
            <Select
              label="정렬 기준"
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              options={sortOptions}
            />

            <div className="flex flex-1 relative">
              <MuiTextField
                fullWidth
                size="small"
                placeholder="고객 이름 또는 매물 주소를 입력해주세요"
                value={searchKeyword}
                onChange={(e) => onSearchKeywordChange(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => {
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
          </div>

          <div className="flex justify-between items-start flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Select
                label="상태 선택"
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                options={CONTRACT_STATUS_OPTION_LIST}
              />

              <div className="flex flex-wrap gap-2">
                {Object.keys(periodMapping).map((label) => (
                  <Button
                    key={label}
                    variant={
                      periodMapping[label] === selectedPeriod
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      periodMapping[label] === selectedPeriod
                        ? "secondary"
                        : "primary"
                    }
                    onClick={() => onPeriodClick(label)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between w-full">
              <Button variant="text" onClick={handleClearFilters}>
                필터 초기화
              </Button>
              <Button
                variant="contained"
                onClick={onAddModalOpen}
                startIcon={<AddIcon />}
              >
                계약 등록
              </Button>
            </div>
          </div>
        </div>

        <ContractTable
          contractList={contractList}
          totalElements={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onRowClick={onRowClick}
        />

        <ContractFilterModal
          open={filterModalOpen}
          onClose={onFilterModalClose}
          initialFilter={{
            period: selectedPeriod || "",
            status: selectedStatus,
          }}
          onApply={onFilterApply}
        />

        <ContractAddModal
          open={isAddModalOpen}
          handleClose={onAddModalClose}
          fetchContractData={onRefreshData}
        />
      </div>
    </div>
  );
};

export default ContractListPageView;
