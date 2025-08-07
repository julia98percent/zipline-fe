import PageHeader from "@components/PageHeader/PageHeader";
import CounselModal from "./CounselModal";
import {
  CounselSearchFilters,
  CounselTypeFilters,
  CounselTable,
} from "./components";
import Button from "@components/Button";
import AddIcon from "@mui/icons-material/Add";
import { Counsel } from "@ts/counsel";
import { Dayjs } from "dayjs";

interface CounselListPageViewProps {
  counsels: Counsel[];
  page: number;
  rowsPerPage: number;
  totalElements: number;
  isLoading: boolean;
  isModalOpen: boolean;
  search: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  selectedType: string | null;
  selectedCompleted: boolean | null;
  onSearchChange: (search: string) => void;
  onStartDateChange: (startDate: Dayjs | null) => void;
  onEndDateChange: (endDate: Dayjs | null) => void;
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
    <>
      <PageHeader title="상담 내역" onMobileMenuToggle={onMobileMenuToggle} />

      <div className="p-5 pt-5 bg-gray-100 min-h-screen">
        {/* 상단 검색/필터 영역 */}
        <div className="p-3 mb-7 rounded-lg bg-white shadow-sm">
          <div className="space-y-5">
            <CounselSearchFilters
              search={search}
              startDate={startDate}
              endDate={endDate}
              onSearchChange={onSearchChange}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
              onSearchClick={onSearchClick}
            />

            <CounselTypeFilters
              selectedType={selectedType}
              selectedCompleted={selectedCompleted}
              onTypeChange={onTypeChange}
              onCompletedChange={onCompletedChange}
            />

            <div className="flex justify-between items-center">
              <Button variant="text" onClick={onResetClick}>
                필터 초기화
              </Button>
              <Button
                variant="contained"
                onClick={onModalOpen}
                startIcon={<AddIcon />}
              >
                상담 등록
              </Button>
            </div>
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

        <CounselModal
          open={isModalOpen}
          onClose={onModalClose}
          onSuccess={onModalSuccess}
        />
      </div>
    </>
  );
}

export default CounselListPageView;
