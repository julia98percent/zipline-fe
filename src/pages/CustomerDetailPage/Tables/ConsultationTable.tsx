import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ConsultationTableProps {
  counselList: Consultation[];
}

interface Consultation {
  counselUid: number;
  title: string;
  type: string;
  counselDate: string;
  dueDate: string;
  propertyUid: number;
  completed: boolean;
}

function ConsultationTable({ counselList = [] }: ConsultationTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  console.log(counselList);
  // 클라이언트 사이드 페이지네이션
  const paginatedConsultations = counselList.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleRowClick = (counselUid: number) => {
    navigate(`/counsels/${counselUid}`);
  };

  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell>유형</TableCell>
              <TableCell>상담일</TableCell>
              <TableCell>예정일</TableCell>
              <TableCell>상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedConsultations.length > 0 ? (
              paginatedConsultations.map((consultation) => (
                <TableRow
                  key={consultation.counselUid}
                  onClick={() => handleRowClick(consultation.counselUid)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>{consultation.title}</TableCell>
                  <TableCell>{consultation.type}</TableCell>
                  <TableCell>
                    {new Date(consultation.counselDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(consultation.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {consultation.completed ? "완료" : "진행중"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    등록된 상담 내역이 없습니다
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          총 {counselList.length}건
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>페이지당 행</InputLabel>
            <Select
              value={rowsPerPage}
              label="페이지당 행"
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0); // 페이지당 행 수 변경시 첫 페이지로 이동
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={Math.ceil(counselList.length / rowsPerPage)}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default ConsultationTable;
