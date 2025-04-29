import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
} from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import { useEffect, useState } from "react";
import apiClient from "@apis/apiClient";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface Counsel {
  counselUid: number;
  title: string;
  type: string;
  counselDate: string;
  dueDate: string;
  completed: boolean;
}

interface CounselListResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    counsels: Counsel[];
  };
}

function CounselListPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounsels = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<CounselListResponse>("/counsels", {
        params: {
          page: page + 1,
          size: rowsPerPage,
          sortFields: JSON.stringify({
            counselDate: "DESC", // 상담일시 기준 내림차순 정렬
          }),
        },
      });

      if (response.data.success) {
        setCounsels(response.data.data.counsels);
        setTotalElements(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch counsels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsels();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
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

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <PageHeader title="상담 내역" userName={user?.name || "-"} />

      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "none",
            border: "1px solid #E0E0E0",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>제목</TableCell>
                  <TableCell>상담 유형</TableCell>
                  <TableCell>상담 예정일</TableCell>
                  <TableCell>의뢰 마감일</TableCell>
                  <TableCell>상태</TableCell>
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
                      상담 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  counsels.map((counsel) => (
                    <TableRow
                      key={counsel.counselUid}
                      hover
                      onClick={() => handleRowClick(counsel.counselUid)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{counsel.title}</TableCell>
                      <TableCell>{counsel.type}</TableCell>
                      <TableCell>
                        {dayjs(counsel.counselDate).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        {dayjs(counsel.dueDate).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: counsel.completed ? "#219653" : "#F2994A",
                            backgroundColor: counsel.completed
                              ? "#E9F7EF"
                              : "#FEF5EB",
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {counsel.completed ? "완료" : "진행중"}
                        </Typography>
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
    </Box>
  );
}

export default CounselListPage;
