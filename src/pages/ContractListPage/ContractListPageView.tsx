import ContractTable from "./ContractTable";
import ContractFilterModal from "./ContractFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import styles from "./styles/ContractListPage.module.css";
import Select from "react-select";
import "./styles/reactSelect.css";
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
  CONTRACT_STATUS_SEARCH_OPTIONS: Array<{ value: string; label: string }>;
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
  CONTRACT_STATUS_SEARCH_OPTIONS,
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
}: ContractListPageViewProps) => {
  return (
    <div className={styles.container}>
      <PageHeader title="계약 목록" />

      <div className={styles.contents}>
        <div className={styles.controlsContainer}>
          <div className={styles.searchBarRow}>
            <Select
              options={sortOptions}
              value={sortOptions.find((opt) => opt.value === selectedSort)}
              onChange={(selected) => onSortChange(selected?.value || "")}
              placeholder="정렬 기준"
              classNamePrefix="custom-select"
              menuShouldScrollIntoView={false}
              styles={{
                control: (base, state) => ({
                  ...base,
                  width: 140,
                  borderRadius: 14,
                  border: state.isFocused
                    ? "1.5px solid #1976d2"
                    : "1.5px solid #ccc",
                  fontSize: 13,
                  minHeight: 36,
                  paddingLeft: 8,
                  boxShadow: "none",
                  "&:hover": { borderColor: "#1976d2" },
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: 8,
                  zIndex: 9999,
                  maxHeight: "none",
                }),
              }}
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
                options={CONTRACT_STATUS_SEARCH_OPTIONS}
                value={CONTRACT_STATUS_SEARCH_OPTIONS.find(
                  (opt) => opt.value === selectedStatus
                )}
                onChange={(selected) => onStatusChange(selected?.value ?? "")}
                placeholder="상태 선택"
                classNamePrefix="custom-select"
                menuShouldScrollIntoView={false}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: 14,
                    border: state.isFocused
                      ? "1.5px solid #1976d2"
                      : "1.5px solid #ccc",
                    fontSize: 13,
                    minHeight: 36,
                    paddingLeft: 8,
                    boxShadow: "none",
                    "&:hover": { borderColor: "#1976d2" },
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: 8,
                    zIndex: 9999,
                    maxHeight: "none",
                  }),
                }}
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
              sx={{
                backgroundColor: "#164F9E",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#0D3B7A", boxShadow: "none" },
                height: "36px",
                fontSize: "13px",
                padding: "0 16px",
              }}
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
