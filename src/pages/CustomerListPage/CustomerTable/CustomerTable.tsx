import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Customer {
  uid: number;
  name: string;
  phoneNo: string;
  trafficSource?: string;
  tenant?: boolean;
  landlord?: boolean;
  buyer?: boolean;
  seller?: boolean;
}

interface Props {
  customerList: Customer[];
  totalCount: number;
  setPage: (newPage: number) => void;
  setRowsPerPage: (newRowsPerPage: number) => void;
  page: number;
  rowsPerPage: number;
  fetchCustomerList: () => void;
}

const CustomerTable = ({
  customerList,
  totalCount,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
}: Props) => {
  const navigate = useNavigate();

  const handleRowClick = (uid: number) => {
    navigate(`/customers/${uid}`); // 고객 상세 페이지로 이동
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">이름</TableCell>
                <TableCell align="center">전화번호</TableCell>
                <TableCell align="center">유입 경로</TableCell>
                <TableCell align="center">임차인</TableCell>
                <TableCell align="center">임대인</TableCell>
                <TableCell align="center">매수자</TableCell>
                <TableCell align="center">매도자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerList.length > 0 ? (
                customerList.map((customer) => (
                  <TableRow
                    key={customer.uid}
                    onClick={() => handleRowClick(customer.uid)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell align="center">{customer.uid}</TableCell>
                    <TableCell align="center">{customer.name}</TableCell>
                    <TableCell align="center">{customer.phoneNo}</TableCell>
                    <TableCell align="center">
                      {customer.trafficSource || "-"}
                    </TableCell>
                    <TableCell align="center">
                      {customer.tenant ? "✔️" : "❌"}
                    </TableCell>
                    <TableCell align="center">
                      {customer.landlord ? "✔️" : "❌"}
                    </TableCell>
                    <TableCell align="center">
                      {customer.buyer ? "✔️" : "❌"}
                    </TableCell>
                    <TableCell align="center">
                      {customer.seller ? "✔️" : "❌"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
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
};

export default CustomerTable;
