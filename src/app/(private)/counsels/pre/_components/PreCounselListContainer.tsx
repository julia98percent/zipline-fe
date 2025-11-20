"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { PreCounselTable } from "@/components/PreCounselTable";
import { PreCounsel } from "@/types/counsel";
import { fetchCounsels } from "@/apis/counselService";

const PreCounselDetailModal = dynamic(
  () => import("@/components/PreCounselDetailModal"),
  { ssr: false }
);

interface PreCounselListContainerProps {
  initialCounsels: PreCounsel[];
  initialTotalElements: number;
}

function PreCounselListContainer({
  initialCounsels,
  initialTotalElements,
}: PreCounselListContainerProps) {
  const { page, rowsPerPage, setPage, setRowsPerPage } = useUrlPagination();

  const [counsels, setCounsels] = useState<PreCounsel[]>(initialCounsels);
  const [isLoading, setIsLoading] = useState(false); // 서버에서 이미 로딩했으므로 false
  const [totalElements, setTotalElements] = useState(initialTotalElements);
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

export default PreCounselListContainer;
