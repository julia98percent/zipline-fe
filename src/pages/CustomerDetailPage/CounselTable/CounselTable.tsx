import { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Paper,
  TableContainer,
} from "@mui/material";

function CounselTable({ counselList }: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedCounsel = counselList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">상담 제목</TableCell>
                <TableCell align="center">상담일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCounsel.length > 0 ? (
                displayedCounsel.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell align="center">{item.title}</TableCell>
                    <TableCell align="center">{item.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2} // TableCell 수에 맞게 colSpan 조정
                    align="center"
                    sx={{
                      padding: "20px 0",
                    }}
                  >
                    상담 데이터가 없습니다
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="페이지당 행"
        />
      </Paper>
    </Box>
  );
}

export default CounselTable;
