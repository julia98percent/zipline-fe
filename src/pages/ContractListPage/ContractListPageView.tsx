import ContractTable from "./ContractTable";
import ContractFilterModal from "./ContractFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import styles from "./styles/ContractListPage.module.css";
import Select from "@components/Select";
import ContractAddModal from "./ContractAddButtonList/ContractAddModal";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
}: ContractListPageViewProps) => {
  return (
    <div className={styles.container}>
      <PageHeader title="계약 목록" onMobileMenuToggle={onMobileMenuToggle} />

      <div className={styles.contents}>
        <div className={styles.controlsContainer}>
          <div className={styles.searchBarRow}>
            <Select
              label="정렬 기준"
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              options={sortOptions}
              className="w-[140px]"
            />

            <div className={styles.searchInputWrapper}>
              <input
                className={styles.searchInput}
                placeholder="검색어를 입력해주세요"
                value={searchKeyword}
                onChange={(e) => onSearchKeywordChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearchSubmit();
                }}
              />
            </div>
          </div>

          <div className={styles.topFilterRow}>
            <div className={styles.filterGroup}>
              <Select
                label="상태 선택"
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                options={CONTRACT_STATUS_OPTION_LIST}
              />

              <div className={styles.filterButtons}>
                {Object.keys(periodMapping).map((label) => (
                  <button
                    key={label}
                    className={
                      periodMapping[label] === selectedPeriod
                        ? `${styles.filterButton} ${styles.filterButtonActive}`
                        : styles.filterButton
                    }
                    onClick={() => onPeriodClick(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddModalOpen}
              className="!bg-blue-800 !shadow-none hover:!bg-blue-900 hover:!shadow-none !h-9 !text-xs !px-4"
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
