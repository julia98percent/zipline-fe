import { useState, useEffect, useCallback } from "react";
import { useUrlPagination } from "@hooks/useUrlPagination";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import PageHeader from "@components/PageHeader";
import PreCounselTable from "@components/PreCounselTable/PreCounselTable";
import { PreCounsel } from "@ts/counsel";
import { fetchCounsels } from "@apis/counselService";

function PreCounselListPage() {
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();

  const [counsels, setCounsels] = useState<PreCounsel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);

  const handleCloseSurveyDetailModal = () => {
    setIsSurveyDetailModalOpen(false);
    setSelectedSurveyId(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCounsels(page, rowsPerPage);

      if (data && data.surveyResponses) {
        setCounsels(data.surveyResponses);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setCounsels([]);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <PageHeader />
      <div className="w-full p-5">
        <PreCounselTable
          counsels={counsels}
          isLoading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onRowClick={(surveyResponseUid) => {
            setSelectedSurveyId(surveyResponseUid);
            setIsSurveyDetailModalOpen(true);
          }}
        />
      </div>
      <PreCounselDetailModal
        open={isSurveyDetailModalOpen}
        onClose={handleCloseSurveyDetailModal}
        surveyResponseUid={selectedSurveyId}
      />
    </>
  );
}

export default PreCounselListPage;
