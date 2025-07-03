import { useState, useEffect, useCallback } from "react";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import PageHeader from "@components/PageHeader";
import PreCounselTable from "@components/PreCounselTable/PreCounselTable";
import { PreCounsel } from "@ts/counsel";
import { fetchCounsels } from "@apis/counselService";

function PreCounselListPage() {
  const [counsels, setCounsels] = useState<PreCounsel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
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
    setPage(0);
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
    <div className="bg-[#f5f5f5]">
      <PageHeader title="사전 상담 목록" />
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
    </div>
  );
}

export default PreCounselListPage;
