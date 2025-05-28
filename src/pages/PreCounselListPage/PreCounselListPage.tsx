import { useState, useEffect, useCallback } from "react";
import {
  Box,
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  CircularProgress,
  Table,
  TablePagination,
} from "@mui/material";
import PageHeader from "@components/PageHeader";
import apiClient from "@apis/apiClient";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function PreCounselListPage() {
  const navigate = useNavigate();

  const [counsels, setCounsels] = useState([]);
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

  const handleRowClick = (counselUid: number) => {
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
      console.log(response);
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
      <Paper
        sx={{
          width: "100%",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>전화번호</TableCell>
                <TableCell>상담 요청일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : counsels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    사전 상담 내역이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                counsels.map((counsel) => (
                  <TableRow
                    key={counsel.surveyResponseUid}
                    hover
                    onClick={() => handleRowClick(counsel.surveyResponseUid)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{counsel.name}</TableCell>
                    <TableCell>{counsel.phoneNumber}</TableCell>
                    <TableCell>
                      {dayjs(counsel.submittedAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}개 중 ${from}-${to}개`
          }
        />
      </Paper>
    </Box>
  );
}

export default PreCounselListPage;
