import { Box } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import CounselModal from "./CounselModal";
import {
  CounselSearchFilters,
  CounselTypeFilters,
  CounselActionButtons,
  CounselTable,
} from "./components";
import { Counsel } from "@ts/counsel";

interface CounselListPageViewProps {
  counsels: Counsel[];
  page: number;
  rowsPerPage: number;
  totalElements: number;
  isLoading: boolean;
  isModalOpen: boolean;
  search: string;
  startDate: string | null;
  endDate: string | null;
  selectedType: string | null;
  selectedCompleted: boolean | null;
  onSearchChange: (search: string) => void;
  onStartDateChange: (startDate: string | null) => void;
  onEndDateChange: (endDate: string | null) => void;
  onTypeChange: (type: string | null) => void;
  onCompletedChange: (completed: boolean | null) => void;
  onSearchClick: () => void;
  onResetClick: () => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (counselUid: number) => void;
  onModalOpen: () => void;
  onModalClose: () => void;
  onModalSuccess: () => void;
  onMobileMenuToggle?: () => void;
}

function CounselListPageView({
  counsels,
  page,
  rowsPerPage,
  totalElements,
  isLoading,
  isModalOpen,
  search,
  startDate,
  endDate,
  selectedType,
  selectedCompleted,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onTypeChange,
  onCompletedChange,
  onSearchClick,
  onResetClick,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  onModalOpen,
  onModalClose,
  onModalSuccess,
  onMobileMenuToggle,
}: CounselListPageViewProps) {
  return (
    <Box
      sx={{
        padding: "20px",
        paddingTop: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <PageHeader title="상담 내역" onMobileMenuToggle={onMobileMenuToggle} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <div className={styles.filterContainer}>
          <CounselSearchFilters
            search={search}
            startDate={startDate}
            endDate={endDate}
            onSearchChange={onSearchChange}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            onSearchClick={onSearchClick}
            onResetClick={onResetClick}
          />

          <div className={styles.typeAndActionRow}>
            <CounselTypeFilters
              selectedType={selectedType}
              selectedCompleted={selectedCompleted}
              onTypeChange={onTypeChange}
              onCompletedChange={onCompletedChange}
            />
            <CounselActionButtons onModalOpen={onModalOpen} />
          </div>
        </div>

        <CounselTable
          counsels={counsels}
          isLoading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onRowClick={onRowClick}
        />
      </Box>

      <CounselModal
        open={isModalOpen}
        onClose={onModalClose}
        onSuccess={onModalSuccess}
      />
    </Box>
  );
}

export default CounselListPageView;
