import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import PageHeader from "@components/PageHeader";
import apiClient from "@apis/apiClient";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Table from "@components/Table";
import { PreCounsel } from "@ts/Counsel";

function PreCounselListPage() {
  const navigate = useNavigate();

  const [counsels, setCounsels] = useState<PreCounsel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleRowClick = (counselUid: string) => {
    navigate(`${counselUid}`);
  };

  const fetchCounsels = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/surveys/responses", {
        params: {
          page: page + 1,
          size: rowsPerPage,
        },
      });
      if (response.data.success) {
        setCounsels(response.data.data.surveyResponses);
        setTotalElements(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch counsels:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchCounsels();
  }, [page, rowsPerPage, fetchCounsels]);

  return (
    <Box>
      <PageHeader title="사전 상담 목록" />
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
    </Box>
  );
}

export default PreCounselListPage;
