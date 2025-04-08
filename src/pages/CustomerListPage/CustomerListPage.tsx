import { useState, useEffect } from "react";
import apiClient from "@apis/apiClient";
import CustomerAddButtonList from "./CustomerAddButtonList";
import CustomerTable from "./CustomerTable";
import { Box, Typography } from "@mui/material";

const CustomerListPage = () => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchCustomerList = () => {
    setLoading(true);
    apiClient
      .get(`/customers?page=${page + 1}&size=${rowsPerPage}`)
      .then((res) => {
        const customerData = res?.data?.data?.customers;

        const total = res?.data?.data?.totalElements || 1;

        if (res.status === 200 && customerData) {
          setCustomerList(customerData);
          setTotalCount(total);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomerList();
  }, [page, rowsPerPage]);

  if (loading) return <div>로딩중</div>;
  return (
    <Box>
      <div className="flex items-center justify-between">
        <Typography
          variant="h6"
          sx={{ mb: 2, minWidth: "max-content", display: "inline", margin: 0 }}
        >
          고객 목록
        </Typography>
        <CustomerAddButtonList fetchCustomerList={fetchCustomerList} />
      </div>
      <CustomerTable
        customerList={customerList}
        totalCount={totalCount}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        fetchCustomerList={fetchCustomerList}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </Box>
  );
};

export default CustomerListPage;
