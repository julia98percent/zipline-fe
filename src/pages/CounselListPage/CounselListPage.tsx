import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCounselList } from "@apis/counselService";
import { showToast } from "@components/Toast";
import CounselListPageView from "./CounselListPageView";
import { Counsel } from "@ts/counsel";
import { useUrlPagination } from "@hooks/useUrlPagination";
import { useUrlFilters } from "@hooks/useUrlFilters";
import dayjs, { Dayjs } from "dayjs";

function CounselListPage() {
  const navigate = useNavigate();
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();
  const {
    getParam,
    getBooleanParam,
    setParam,
    setParams,
    clearAllFilters,
    searchParams,
  } = useUrlFilters();

  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const searchQuery = getParam("q") || "";
  const startDate = useMemo(() => {
    const dateStr = getParam("startDate");
    return dateStr ? dayjs(dateStr) : null;
  }, [searchParams]);
  const endDate = useMemo(() => {
    const dateStr = getParam("endDate");
    return dateStr ? dayjs(dateStr) : null;
  }, [searchParams]);
  const selectedType = getParam("type") || null;
  const selectedCompleted = getParam("completed")
    ? getBooleanParam("completed")
    : null;

  const fetchCounsels = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchCounselList({
        page,
        size: rowsPerPage,
        search: searchQuery || undefined,
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
    searchQuery,
    startDate,
    endDate,
    selectedType,
    selectedCompleted,
  ]);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

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

    setParams({
      q: search || null,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      type: selectedType || null,
      completed: selectedCompleted !== null ? selectedCompleted : null,
    });
  };

  const handleResetClick = () => {
    clearAllFilters();
    setSearch("");
  };

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
  }, []);

  const handleStartDateChange = useCallback(
    (newStartDate: Dayjs | null) => {
      setParam(
        "startDate",
        newStartDate ? newStartDate.format("YYYY-MM-DD") : ""
      );
    },
    [setParam]
  );

  const handleEndDateChange = useCallback(
    (newEndDate: Dayjs | null) => {
      setParam("endDate", newEndDate ? newEndDate.format("YYYY-MM-DD") : "");
    },
    [setParam]
  );

  const handleTypeChange = useCallback(
    (newType: string | null) => {
      setParam("type", newType || "");
    },
    [setParam]
  );

  const handleCompletedChange = useCallback(
    (newCompleted: boolean | null) => {
      setParam("completed", newCompleted !== null ? newCompleted : "");
    },
    [setParam]
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (counselUid: number) => {
    navigate(`/counsels/general/${counselUid}`);
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
      onSearchChange={handleSearchChange}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onTypeChange={handleTypeChange}
      onCompletedChange={handleCompletedChange}
      onSearchClick={handleSearchClick}
      onResetClick={handleResetClick}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      onRowClick={handleRowClick}
      onModalOpen={() => setIsModalOpen(true)}
      onModalClose={() => setIsModalOpen(false)}
      onModalSuccess={handleModalSuccess}
    />
  );
}

export default CounselListPage;
