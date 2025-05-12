import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
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
                    <Chip
                      label={consultation.completed ? "완료" : "진행중"}
                      size="small"
                      sx={{
                        backgroundColor: consultation.completed ? "#E9F7EF" : "#FEF5EB",
                        color: consultation.completed ? "#219653" : "#F2994A",
                        height: "24px",
                        "& .MuiChip-label": {
                          px: 1,
                          fontSize: "12px"
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <div style={{ color: '#757575', fontSize: '1rem' }}>
                    등록된 상담 내역이 없습니다
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={counselList.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="페이지당 행 수"
        labelDisplayedRows={({ from, to, count }) =>
          `${count}건 중 ${from}-${to}건`
        }
      />
    </Paper>
  );
}

export default ConsultationTable;
