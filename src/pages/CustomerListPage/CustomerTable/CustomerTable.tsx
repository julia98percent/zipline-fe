import { useState } from "react";
// import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Paper,
} from "@mui/material";

const DUMMY_CUSTOMER_DATA = {
  success: true,
  code: 200,
  message: "고객 목록 조회에 성공하였습니다.",
  data: {
    customers: [
      {
        uid: 1,
        name: "John Doe",
        phoneNo: "010-1111-2222",
        trafficSource: "Website",
        tenant: true,
        landlord: false,
        buyer: false,
        seller: false,
      },
      {
        uid: 2,
        name: "Jane Smith",
        phoneNo: "010-3333-4444",
        trafficSource: "Referral",
        tenant: false,
        landlord: true,
        buyer: true,
        seller: false,
      },
      {
        uid: 3,
        name: "Alice Johnson",
        phoneNo: "010-5555-6666",
        trafficSource: null,
        tenant: false,
        landlord: false,
        buyer: false,
        seller: true,
      },
    ],
    page: 1,
    size: 2,
    totalElements: 3,
    totalPages: 2,
    hasNext: true,
  },
};

const CustomerTable = () => {
  // const [customerList, setCustomerList] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);

  // const getCustomerList = () => {
  //   axios
  //   .get(`${import.meta.env.VITE_SERVER_URL}/customers?page=${page}&size=${rowsPerPage}`, {
  //     withCredentials: true,
  //     headers: {
  //       Authorization: `Bearer ${sessionStorage.getItem("_ZA") || ""}`,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //   .then((res) => {
  //     const customerData = res?.data?.data?.customer;
  //     if (res.status === 200 && customerData) {
  //       setCustomerList(customerData);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const customers = DUMMY_CUSTOMER_DATA.data.customers;

  const displayedCustomers = customers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        고객 목록
      </Typography>
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
              {displayedCustomers.map((customer) => (
                <TableRow key={customer.uid}>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={customers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[2, 5, 10]}
          labelRowsPerPage="페이지당 행"
        />
      </Paper>
    </Box>
  );
};

export default CustomerTable;
