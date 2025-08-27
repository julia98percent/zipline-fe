import ContractTable from "./ContractTable";
import ContractFilterModal from "./ContractFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import Select, { StringSelect } from "@components/Select";
import ContractAddModal from "./ContractAddModal";
import Button from "@components/Button";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, IconButton } from "@mui/material";
import { Contract } from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import CircularProgress from "@components/CircularProgress";
import TextField from "@components/TextField";

interface ContractListPageViewProps {
  loading: boolean;
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
  EXPIRED_PERIOD: string[];
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
  handleClearFilters: () => void;
}

const ContractListPageView = ({
  loading,
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
  EXPIRED_PERIOD,
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

  handleClearFilters,
}: ContractListPageViewProps) => {
  if (loading) {
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
    <div>
      <PageHeader />

      <div className="p-5 pt-0">
        <div className="flex flex-col card p-3 gap-1 xs:gap-4">
          <div className="grid grid-cols-[1fr_3fr] gap-3">
            <Select
              fullWidth
              label="정렬 기준"
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              options={sortOptions}
            />

            <TextField
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

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-3">
            <StringSelect
              label="상태 선택"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              options={CONTRACT_STATUS_OPTION_LIST}
              className="mt-auto"
            />

            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
              <span className="text-sm font-medium text-neutral-600">
                만료 예정일
              </span>
              <div className="flex gap-1">
                {EXPIRED_PERIOD.map((label: string) => (
                  <Button
                    key={label}
                    variant={
                      label === selectedPeriod ? "contained" : "outlined"
                    }
                    color={label === selectedPeriod ? "secondary" : "primary"}
                    onClick={() => onPeriodClick(label)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
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
