import { useState, useEffect, useCallback } from "react";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import PageHeader from "@components/PageHeader";
import apiClient from "@apis/apiClient";
import dayjs from "dayjs";
import Table from "@components/Table";
import { PreCounsel } from "@ts/Counsel";
import { fetchCounsels } from "@apis/counselService";

function PreCounselListPage() {
  const [counsels, setCounsels] = useState<PreCounsel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [surveyDetailLoading, setSurveyDetailLoading] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const handleRowClick = async (rowData: string) => {
    setSurveyDetailLoading(true);
    setIsSurveyDetailModalOpen(true);
    try {
      const response = await apiClient.get(`/surveys/responses/${rowData.id}`);
      if (response.data.success) {
        setSelectedSurvey(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch survey detail:", error);
    } finally {
      setSurveyDetailLoading(false);
    }
  };

  const handleCloseSurveyDetailModal = () => {
    setIsSurveyDetailModalOpen(false);
    setSelectedSurvey(null);
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
      setCounsels(data.surveyResponses);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching data", error);
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
        <Table
          isLoading={isLoading}
          headerList={["이름", "전화번호", "상담 요청일"]}
          bodyList={counsels.map((counsel) => ({
            name: counsel.name,
            phoneNumber: counsel.phoneNumber,
            submittedAt: dayjs(counsel.submittedAt).format("YYYY-MM-DD"),
            id: `${counsel.surveyResponseUid}`,
          }))}
          handleRowClick={handleRowClick}
          totalElements={totalElements}
          page={page}
          handleChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
      <PreCounselDetailModal
        open={isSurveyDetailModalOpen}
        onClose={handleCloseSurveyDetailModal}
        preCounselDetail={selectedSurvey}
        isLoading={surveyDetailLoading}
      />
    </div>
  );
}

export default PreCounselListPage;
