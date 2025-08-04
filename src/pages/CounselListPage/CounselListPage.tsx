import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { fetchCounselList } from "@apis/counselService";
import { showToast } from "@components/Toast/Toast";
import CounselListPageView from "./CounselListPageView";
import { Counsel } from "@ts/counsel";
import { DEFAULT_ROWS_PER_PAGE } from "@components/Table/Table";
import dayjs, { Dayjs } from "dayjs";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const COUNSEL_STORAGE_KEY = 'counselFilters';

function CounselListPage() {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const [storedData] = useState(() => {
    try {
      const stored = sessionStorage.getItem(COUNSEL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [page, setPage] = useState(storedData?.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(storedData?.rowsPerPage || DEFAULT_ROWS_PER_PAGE);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState(storedData?.search || "");
  const [startDate, setStartDate] = useState<Dayjs | null>(
    storedData?.startDate ? dayjs(storedData.startDate) : null
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    storedData?.endDate ? dayjs(storedData.endDate) : null
  );
  const [selectedType, setSelectedType] = useState<string | null>(storedData?.selectedType || null);
  const [selectedCompleted, setSelectedCompleted] = useState<boolean | null>(
    storedData?.selectedCompleted ?? null
  );

  const fetchCounsels = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchCounselList({
        page,
        size: rowsPerPage,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        type: selectedType || undefined,
        completed: selectedCompleted ?? undefined,
      });

      setCounsels(result.counsels);
      setTotalElements(result.totalElements);
    } catch (error) {
      console.error("Failed to fetch counsels:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    search,
    startDate,
    endDate,
    selectedType,
    selectedCompleted,
  ]);

  useEffect(() => {
    const dataToStore = {
      page,
      rowsPerPage,
      search,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      selectedType,
      selectedCompleted,
    };
    sessionStorage.setItem(COUNSEL_STORAGE_KEY, JSON.stringify(dataToStore));
  }, [page, rowsPerPage, search, startDate, endDate, selectedType, selectedCompleted]);

  useEffect(() => {
    fetchCounsels();
  }, [fetchCounsels]);

  const handleSearchClick = () => {
    if (startDate && endDate && startDate > endDate) {
      showToast({
        message: "시작일은 종료일보다 빠르거나 같아야 합니다.",
        type: "error",
      });
      return;
    }

    setPage(0);
    fetchCounsels();
  };

  const handleResetClick = () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    setSelectedType(null);
    setSelectedCompleted(null);
    setPage(0);
    fetchCounsels();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (counselUid: number) => {
    navigate(`/counsels/${counselUid}`);
  };

  const handleModalSuccess = () => {
    fetchCounsels();
    showToast({
      message: "상담을 등록했습니다.",
      type: "success",
    });
    setIsModalOpen(false);
  };

  return (
    <CounselListPageView
      counsels={counsels}
      page={page}
      rowsPerPage={rowsPerPage}
      totalElements={totalElements}
      isLoading={isLoading}
      isModalOpen={isModalOpen}
      search={search}
      startDate={startDate}
      endDate={endDate}
      selectedType={selectedType}
      selectedCompleted={selectedCompleted}
      onSearchChange={setSearch}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onTypeChange={setSelectedType}
      onCompletedChange={setSelectedCompleted}
      onSearchClick={handleSearchClick}
      onResetClick={handleResetClick}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      onRowClick={handleRowClick}
      onModalOpen={() => setIsModalOpen(true)}
      onModalClose={() => setIsModalOpen(false)}
      onModalSuccess={handleModalSuccess}
      onMobileMenuToggle={onMobileMenuToggle}
    />
  );
}

export default CounselListPage;
