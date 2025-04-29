import { useState, useEffect } from "react";
import apiClient from "@apis/apiClient";
import CustomerAddButtonList from "./CustomerAddButtonList";
import CustomerTable from "./CustomerTable/CustomerTable";
import CustomerFilterModal from "./CustomerFilterModal/CustomerFilterModal";
import { Box, Typography, CircularProgress, TextField, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import useDebounce from "@hooks/useDebounce";
import PageHeader from "@components/PageHeader/PageHeader";

const CustomerListPage = () => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    tenant: false,
    landlord: false,
    buyer: false,
    seller: false,
    noRole: false,
    minPrice: "",
    maxPrice: "",
    minDeposit: "",
    maxDeposit: "",
    minRent: "",
    maxRent: "",
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchCustomerList = () => {
    setLoading(true);

    const queryParams = new URLSearchParams({
      page: (page + 1).toString(),
      size: rowsPerPage.toString(),
    });

    if (debouncedSearchTerm) {
      queryParams.append("search", debouncedSearchTerm);
    }

    // 필터 값을 QueryString에 포함
    Object.entries(filters).forEach(([key, value]) => {
      // 역할 관련 키 처리
      if (['tenant', 'landlord', 'buyer', 'seller', 'noRole'].includes(key)) {
        // noRole이 true일 때는 noRole만 전송
        if (filters.noRole) {
          if (key === 'noRole') {
            queryParams.append(key, value.toString());
          }
          return;
        }
        // noRole이 아닌 경우, true인 역할만 전송
        if (value === true) {
          queryParams.append(key, value.toString());
        }
        return;
      }
      
      // 나머지 필터 값 처리
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  
    apiClient
      .get(`/customers?${queryParams.toString()}`)
      .then((res) => {
        const customerData = res?.data?.data?.customers;
        const total = res?.data?.data?.totalElements || 1;
  
        if (res.status === 200 && customerData) {
          setCustomerList(customerData);
          setTotalCount(total);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomerList();
  }, [page, rowsPerPage, debouncedSearchTerm, filters]);

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
    setPage(0);
  };

  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 64px)",
          overflow: "auto",
          width: "calc(100% - 240px)",
          ml: "240px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        width: "calc(100% - 240px)",
        ml: "240px",
        backgroundColor: "#f5f5f5",
        p: 0,
      }}
    >
      <PageHeader title="고객 목록" userName="사용자 이름" />

      <Box sx={{ p: 3, pt: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <CustomerAddButtonList fetchCustomerList={fetchCustomerList} />
        </div>

        <div className="flex items-center gap-2 mb-6 justify-end">
          <TextField
            placeholder="전화번호 또는 고객이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ 
              width: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                backgroundColor: '#F5F5F5',
              },
            }}
          />
          <IconButton 
            onClick={() => setFilterModalOpen(true)}
            sx={{ 
              backgroundColor: "#F5F5F5",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#E0E0E0" },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </div>

        <CustomerTable
          customerList={customerList}
          totalCount={totalCount}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
        />

        <CustomerFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filters={filters}
          setFilters={setFilters}
          onApply={handleFilterApply}
        />
      </Box>
    </Box>
  );
};

export default CustomerListPage;
